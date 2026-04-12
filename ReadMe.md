# AnyAdviceApp Waitlist - AI Agent Guidelines

## Architecture Overview
This is a Django-based waitlist application for AnyAdviceApp, an anonymous counselling platform. The project consists of:
- **Core App**: `waitlist/` - Handles registrations, surveys, contact forms, and admin notifications
- **Frontend**: Single-page HTML templates with vanilla JavaScript for interactive forms and UI effects
- **Data Flow**: User submits via JS fetch → Django API views → Database save → Async email notification to admins

Key components:
- `Registration` model: Stores waitlist signups (name, email, phone, consent)
- `Survey` model: Optional follow-up survey linked to registration (counselling preferences, payment, demographics)
- API endpoints: `/api/register`, `/api/survey`, `/api/contact`, `/api/stats`
- Email system: Branded HTML notifications sent via Gmail SMTP to `theanyadviceapp@gmail.com` + CC

## Critical Workflows
- **Development Server**: `python manage.py runserver` (runs on default port 8000)
- **Database Setup**: `python manage.py migrate` (uses SQLite by default)
- **Email Configuration**: Set `EMAIL_HOST_PASSWORD` env var to Gmail App Password for SMTP notifications
- **Admin Access**: Visit `/admin/` after creating superuser with `python manage.py createsuperuser`
- **Static Files**: Served via Django's staticfiles app; collect with `python manage.py collectstatic` for production

## Project-Specific Patterns
- **Async Email Sending**: Use `_send_async()` helper in views to fire-and-forget emails without blocking API responses
- **CSRF Handling**: API endpoints use `@csrf_exempt` for JS fetch calls; CSRF token extracted from cookies for form submissions
- **Error Responses**: APIs return JSON with `errors` dict (field-specific) or `general` key; status codes: 400/422/409
- **Email Branding**: All admin emails use `_base_html()` wrapper with AnyAdviceApp styling (black header, Urbanist font)
- **Admin Customization**: Custom list displays, inlines (Survey inside Registration), CSV export actions
- **Model Properties**: `Registration.full_name`, `Survey.counselling_list/sources_list` for display formatting
- **Validation**: Client-side JS + server-side checks; email regex: `r"^[^\s@]+@[^\s@]+\.[^\s@]+$"`
- **Frontend Interactions**: Forms submit via `fetch()` to APIs; success/error handled with toast notifications
- **UI Effects**: Scroll progress bar, particle background, button ripples implemented in vanilla JS

## Key Files
- `waitlist/models.py`: Data models with choices (PAYMENT_CHOICES, AGE_CHOICES)
- `waitlist/views.py`: API logic with JSON responses and async email triggers
- `waitlist/emails.py`: Email templates and sending logic (HTML branded, text fallback)
- `waitlist/admin.py`: Custom admin with exports, inlines, and display methods
- `templates/index.html`: Main landing page with embedded forms and JS
- `static/script.js`: UI interactions, particles, toasts, form submissions
- `aaa_waitlist/settings.py`: Gmail SMTP config, admin branding, static files setup

## Integration Points
- **Email Service**: Gmail SMTP (host: smtp.gmail.com, port 587, TLS); requires App Password
- **Admin Notifications**: Emails sent to hardcoded addresses with CC; include admin portal links
- **Static Assets**: Fonts (Urbanist from Google), icons/images in `static/assets/`
- **Environment Variables**: `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS`, `EMAIL_HOST_PASSWORD`</content>
<parameter name="filePath">/Users/benjieok/aaa-waitlist/AGENTS.md
