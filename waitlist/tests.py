import json
from unittest.mock import patch

from django.test import TestCase, TransactionTestCase

from .models import Registration, Survey


class StatsApiTests(TestCase):
    def test_stats_returns_waitlist_count(self):
        Registration.objects.create(
            first_name="Ada",
            last_name="Lovelace",
            email="ada@example.com",
            phone="123",
            consent=True,
        )
        Registration.objects.create(
            first_name="Alan",
            last_name="Turing",
            email="alan@example.com",
            phone="456",
            consent=True,
        )

        response = self.client.get("/api/stats")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"waitlistCount": 2})


class RegisterApiTests(TransactionTestCase):
    def test_register_rejects_invalid_payload(self):
        payload = {
            "firstName": "A",
            "lastName": "",
            "email": "invalid-email",
            "consent": False,
        }

        response = self.client.post(
            "/api/register",
            data=json.dumps(payload),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 422)
        self.assertEqual(Registration.objects.count(), 0)
        self.assertIn("firstName", response.json()["errors"])
        self.assertIn("lastName", response.json()["errors"])
        self.assertIn("email", response.json()["errors"])
        self.assertIn("consent", response.json()["errors"])

    @patch("waitlist.views._send_async")
    def test_register_creates_registration_and_returns_position(self, mocked_send_async):
        payload = {
            "firstName": "Grace",
            "lastName": "Hopper",
            "email": "GRACE@EXAMPLE.COM",
            "phone": "555-0100",
            "consent": True,
        }

        response = self.client.post(
            "/api/register",
            data=json.dumps(payload),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json(), {"success": True, "position": 1})
        self.assertEqual(Registration.objects.count(), 1)

        reg = Registration.objects.get()
        self.assertEqual(reg.first_name, "Grace")
        self.assertEqual(reg.last_name, "Hopper")
        self.assertEqual(reg.email, "grace@example.com")
        self.assertEqual(reg.phone, "555-0100")
        self.assertTrue(reg.consent)

        mocked_send_async.assert_called_once()

    @patch("waitlist.views._send_async")
    def test_register_rejects_duplicate_email(self, mocked_send_async):
        Registration.objects.create(
            first_name="Grace",
            last_name="Hopper",
            email="grace@example.com",
            phone="",
            consent=True,
        )

        payload = {
            "firstName": "Another",
            "lastName": "Person",
            "email": "grace@example.com",
            "phone": "",
            "consent": True,
        }

        response = self.client.post(
            "/api/register",
            data=json.dumps(payload),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 409)
        self.assertEqual(
            response.json(), {"errors": {"email": "This email is already registered"}}
        )
        self.assertEqual(Registration.objects.count(), 1)
        mocked_send_async.assert_not_called()


class SurveyApiTests(TestCase):
    @patch("waitlist.views._send_async")
    def test_survey_links_to_registration_and_persists_fields(self, mocked_send_async):
        reg = Registration.objects.create(
            first_name="Jane",
            last_name="Doe",
            email="jane@example.com",
            phone="",
            consent=True,
        )

        payload = {
            "email": "JANE@EXAMPLE.COM",
            "counsellingTypes": ["individual", "anxiety"],
            "paymentPreference": "freemium",
            "priceWillingness": "50",
            "ageRange": "25-34",
            "sources": ["tiktok", "friend"],
            "extraNotes": "Would prefer evening sessions.",
        }

        response = self.client.post(
            "/api/survey",
            data=json.dumps(payload),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json(), {"success": True})
        self.assertEqual(Survey.objects.count(), 1)

        survey = Survey.objects.get()
        self.assertEqual(survey.registration, reg)
        self.assertEqual(survey.email, "jane@example.com")
        self.assertEqual(survey.counselling_types, "individual,anxiety")
        self.assertEqual(survey.payment_preference, "freemium")
        self.assertEqual(survey.price_willingness, "50")
        self.assertEqual(survey.age_range, "25-34")
        self.assertEqual(survey.sources, "tiktok,friend")
        self.assertEqual(survey.extra_notes, "Would prefer evening sessions.")

        mocked_send_async.assert_called_once()


class ContactApiTests(TestCase):
    def test_contact_rejects_invalid_payload(self):
        payload = {
            "firstName": "A",
            "lastName": "",
            "email": "not-an-email",
            "message": "short",
        }

        response = self.client.post(
            "/api/contact",
            data=json.dumps(payload),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 422)
        body = response.json()
        self.assertIn("firstName", body["errors"])
        self.assertIn("lastName", body["errors"])
        self.assertIn("email", body["errors"])
        self.assertIn("message", body["errors"])

    @patch("waitlist.views._send_async")
    def test_contact_accepts_valid_payload_and_defaults_subject(self, mocked_send_async):
        payload = {
            "firstName": "Alex",
            "lastName": "Morgan",
            "email": "ALEX@EXAMPLE.COM",
            "message": "I would like more details about your counselling options.",
            "subject": "",
        }

        response = self.client.post(
            "/api/contact",
            data=json.dumps(payload),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json(), {"success": True})

        mocked_send_async.assert_called_once()
        sent_payload = mocked_send_async.call_args[0][1]
        self.assertEqual(sent_payload["first_name"], "Alex")
        self.assertEqual(sent_payload["last_name"], "Morgan")
        self.assertEqual(sent_payload["email"], "alex@example.com")
        self.assertEqual(sent_payload["subject"], "General Enquiry")
        self.assertIn("counselling options", sent_payload["message"])
