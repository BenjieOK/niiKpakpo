import json
import re
import threading

from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from .models import Registration, Survey
from .emails import send_registration_email, send_survey_email, send_contact_email

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def _send_async(fn, *args):
    """Fire-and-forget: send email in a background thread so the API stays fast."""
    t = threading.Thread(target=fn, args=args, daemon=True)
    t.start()


# ── Landing page ──────────────────────────────────────────────────

def index(request):
    return render(request, "index.html")


def careers(request):
    return render(request, "careers.html")


def privacy(request):
    return render(request, "privacy.html")


def terms(request):
    return render(request, "terms.html")


def contact(request):
    return render(request, "contact.html")


# ── API: stats ────────────────────────────────────────────────────

@require_GET
def stats(request):
    count = Registration.objects.count()
    return JsonResponse({"waitlistCount": count})


# ── API: register ─────────────────────────────────────────────────

@csrf_exempt
@require_POST
def register(request):
    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, ValueError):
        return JsonResponse({"errors": {"general": "Invalid request body"}}, status=400)

    first_name = data.get("firstName", "").strip()
    last_name  = data.get("lastName",  "").strip()
    email      = data.get("email",     "").strip().lower()
    phone      = data.get("phone",     "").strip()
    consent    = bool(data.get("consent", False))

    errors = {}
    if len(first_name) < 2:
        errors["firstName"] = "Please enter your first name"
    if len(last_name) < 2:
        errors["lastName"] = "Please enter your last name"
    if not EMAIL_RE.match(email):
        errors["email"] = "Please enter a valid email address"
    if not consent:
        errors["consent"] = "You must agree to the privacy policy"
    if errors:
        return JsonResponse({"errors": errors}, status=422)

    try:
        reg = Registration.objects.create(
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone=phone,
            consent=consent,
        )
    except Exception:
        return JsonResponse(
            {"errors": {"email": "This email is already registered"}}, status=409
        )

    position = Registration.objects.count()
    _send_async(send_registration_email, reg)
    return JsonResponse({"success": True, "position": position}, status=201)


# ── API: survey ───────────────────────────────────────────────────

@csrf_exempt
@require_POST
def survey(request):
    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, ValueError):
        return JsonResponse({"errors": {"general": "Invalid request body"}}, status=400)

    email = data.get("email", "").strip().lower()

    registration = None
    if email:
        registration = Registration.objects.filter(email=email).first()

    s = Survey.objects.create(
        registration=registration,
        email=email,
        counselling_types=",".join(data.get("counsellingTypes", [])),
        payment_preference=data.get("paymentPreference", ""),
        price_willingness=str(data.get("priceWillingness", "")),
        age_range=data.get("ageRange", ""),
        sources=",".join(data.get("sources", [])),
        extra_notes=data.get("extraNotes", "").strip(),
    )

    _send_async(send_survey_email, s)
    return JsonResponse({"success": True}, status=201)


# ── API: contact ──────────────────────────────────────────────────

@csrf_exempt
@require_POST
def contact_api(request):
    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, ValueError):
        return JsonResponse({"errors": {"general": "Invalid request body"}}, status=400)

    first_name = data.get("firstName", "").strip()
    last_name  = data.get("lastName",  "").strip()
    email      = data.get("email",     "").strip().lower()
    subject    = data.get("subject",   "").strip() or "General Enquiry"
    message    = data.get("message",   "").strip()

    errors = {}
    if len(first_name) < 2:
        errors["firstName"] = "Please enter your first name"
    if len(last_name) < 2:
        errors["lastName"] = "Please enter your last name"
    if not EMAIL_RE.match(email):
        errors["email"] = "Please enter a valid email address"
    if len(message) < 10:
        errors["message"] = "Please enter a message"
    if errors:
        return JsonResponse({"errors": errors}, status=422)

    payload = {
        "first_name": first_name,
        "last_name":  last_name,
        "email":      email,
        "subject":    subject,
        "message":    message,
    }
    _send_async(send_contact_email, payload)
    return JsonResponse({"success": True}, status=201)
