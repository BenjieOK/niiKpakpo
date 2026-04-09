from django.core.mail import EmailMultiAlternatives
from django.conf import settings


MAIN_TO = "theanyadviceapp@gmail.com"
CC      = ["bkwasiowusu@gmail.com"]


def _base_html(title, body_html):
    """Wrap content in a consistent branded email shell."""
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>{title}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Urbanist',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0"
             style="background:#ffffff;border-radius:16px;overflow:hidden;
                    box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#111111;padding:32px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <span style="font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">
                    🧠 AnyAdviceApp
                  </span>
                </td>
                <td align="right">
                  <span style="font-size:12px;color:#999999;font-weight:500;">
                    Admin Notification
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            {body_html}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9f9f9;padding:24px 40px;border-top:1px solid #eeeeee;">
            <p style="margin:0;font-size:12px;color:#aaaaaa;text-align:center;line-height:1.6;">
              AnyAdviceApp &bull; A safe space for everyone<br/>
              This is an automated notification. Do not reply to this email.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>"""


def _row(label, value):
    return f"""
    <tr>
      <td style="padding:10px 16px;font-size:13px;font-weight:600;color:#777777;
                 background:#f9f9f9;border-radius:6px 0 0 6px;width:38%;">{label}</td>
      <td style="padding:10px 16px;font-size:14px;color:#111111;
                 background:#f9f9f9;border-left:3px solid #111111;
                 border-radius:0 6px 6px 0;">{value or "—"}</td>
    </tr>
    <tr><td colspan="2" style="height:4px;"></td></tr>"""


def send_registration_email(registration):
    """Notify admins when a new user joins the waitlist."""
    from .models import Registration
    position = Registration.objects.count()

    subject = f"🎉 New Waitlist Sign-up #{position} — {registration.first_name} {registration.last_name}"

    text = (
        f"New waitlist registration!\n\n"
        f"Name:     {registration.first_name} {registration.last_name}\n"
        f"Email:    {registration.email}\n"
        f"Phone:    {registration.phone or '—'}\n"
        f"Position: #{position}\n"
        f"Consent:  {'Yes' if registration.consent else 'No'}\n"
        f"Time:     {registration.created_at:%Y-%m-%d %H:%M UTC}\n"
    )

    body = f"""
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#111111;">
      New Waitlist Sign-up
    </h2>
    <p style="margin:0 0 28px;font-size:15px;color:#777777;">
      Someone just joined the waiting list. Here are their details:
    </p>

    <!-- Position badge -->
    <div style="text-align:center;margin-bottom:28px;">
      <span style="display:inline-block;background:#111111;color:#ffffff;
                   font-size:28px;font-weight:800;padding:16px 40px;
                   border-radius:12px;letter-spacing:-1px;">
        #{position}
      </span>
      <p style="margin:8px 0 0;font-size:13px;color:#999999;">Queue Position</p>
    </div>

    <!-- Data table -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      {_row("First Name", registration.first_name)}
      {_row("Last Name", registration.last_name)}
      {_row("Email", registration.email)}
      {_row("Phone", registration.phone or None)}
      {_row("Consent", "✓ Yes" if registration.consent else "✗ No")}
      {_row("Registered At", registration.created_at.strftime("%d %b %Y, %H:%M UTC"))}
    </table>

    <div style="background:#f0f0f0;border-radius:10px;padding:16px 20px;">
      <p style="margin:0;font-size:13px;color:#555555;">
        📊 Total waitlist size is now <strong style="color:#111111;">{position} members</strong>.
        View all registrations in the
        <a href="{settings.SITE_URL}/admin/waitlist/registration/"
           style="color:#111111;font-weight:600;">admin portal</a>.
      </p>
    </div>
    """

    html = _base_html(subject, body)
    _send(subject, text, html)


def send_survey_email(survey):
    """Notify admins when a survey is completed."""
    counselling = survey.counselling_types.replace(",", ", ") if survey.counselling_types else "—"
    sources     = survey.sources.replace(",", ", ") if survey.sources else "—"
    payment     = survey.get_payment_preference_display() if survey.payment_preference else "—"
    age         = survey.get_age_range_display() if survey.age_range else "—"
    price       = f"£{survey.price_willingness}" if survey.price_willingness else "—"

    name = "Anonymous"
    if survey.registration:
        name = f"{survey.registration.first_name} {survey.registration.last_name}"

    subject = f"📋 Survey Completed — {name}"

    text = (
        f"New survey response!\n\n"
        f"Respondent:  {name}\n"
        f"Email:       {survey.email or '—'}\n"
        f"Counselling: {counselling}\n"
        f"Payment:     {payment}\n"
        f"Price:       {price}\n"
        f"Age:         {age}\n"
        f"Sources:     {sources}\n"
        f"Notes:       {survey.extra_notes or '—'}\n"
        f"Time:        {survey.created_at:%Y-%m-%d %H:%M UTC}\n"
    )

    body = f"""
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#111111;">
      Survey Response Received
    </h2>
    <p style="margin:0 0 28px;font-size:15px;color:#777777;">
      A user has completed the 3-step survey. Here are their responses:
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      {_row("Respondent", name)}
      {_row("Email", survey.email or None)}
      {_row("Counselling Interests", counselling)}
      {_row("Payment Preference", payment)}
      {_row("Price Willingness", price)}
      {_row("Age Range", age)}
      {_row("Heard Via", sources)}
      {_row("Submitted At", survey.created_at.strftime("%d %b %Y, %H:%M UTC"))}
    </table>

    {"" if not survey.extra_notes else f'''
    <div style="background:#f9f9f9;border-left:3px solid #111111;
                border-radius:0 10px 10px 0;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#999999;
                text-transform:uppercase;letter-spacing:0.5px;">Additional Notes</p>
      <p style="margin:0;font-size:14px;color:#333333;line-height:1.6;">
        {survey.extra_notes}
      </p>
    </div>
    '''}

    <div style="background:#f0f0f0;border-radius:10px;padding:16px 20px;">
      <p style="margin:0;font-size:13px;color:#555555;">
        View this response in the
        <a href="{settings.SITE_URL}/admin/waitlist/survey/"
           style="color:#111111;font-weight:600;">admin portal →</a>
      </p>
    </div>
    """

    html = _base_html(subject, body)
    _send(subject, text, html)


def send_contact_email(payload):
    """Forward a contact form submission to the admins."""
    name    = f"{payload['first_name']} {payload['last_name']}"
    subject = f"📬 Contact Form: {payload['subject']} — {name}"

    text = (
        f"New contact form message!\n\n"
        f"Name:    {name}\n"
        f"Email:   {payload['email']}\n"
        f"Subject: {payload['subject']}\n\n"
        f"Message:\n{payload['message']}\n"
    )

    body = f"""
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#111111;">
      New Contact Message
    </h2>
    <p style="margin:0 0 28px;font-size:15px;color:#777777;">
      Someone sent a message via the contact form. Details below:
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      {_row("Name", name)}
      {_row("Email", f'<a href="mailto:{payload["email"]}" style="color:#111;font-weight:600;">{payload["email"]}</a>')}
      {_row("Subject", payload['subject'])}
    </table>

    <div style="background:#f9f9f9;border-left:3px solid #111111;
                border-radius:0 10px 10px 0;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#999999;
                text-transform:uppercase;letter-spacing:0.5px;">Message</p>
      <p style="margin:0;font-size:14px;color:#333333;line-height:1.7;white-space:pre-wrap;">{payload['message']}</p>
    </div>

    <div style="background:#f0f0f0;border-radius:10px;padding:16px 20px;">
      <p style="margin:0;font-size:13px;color:#555555;">
        Reply directly to <a href="mailto:{payload['email']}"
           style="color:#111111;font-weight:600;">{payload['email']}</a> to respond.
      </p>
    </div>
    """

    html = _base_html(subject, body)
    _send(subject, text, html)


def _send(subject, text, html):
    try:
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[MAIN_TO],
            cc=CC,
        )
        msg.attach_alternative(html, "text/html")
        msg.send(fail_silently=False)
    except Exception as e:
        # Log but never crash the API response
        import logging
        logging.getLogger("waitlist.emails").error("Failed to send email: %s", e)
