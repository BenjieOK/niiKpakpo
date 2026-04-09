from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent

# Keep the secret key out of version control — override via environment variable in production
SECRET_KEY = os.environ.get(
    "DJANGO_SECRET_KEY",
    "django-insecure-aaa-waitlist-dev-key-change-this-before-deploying",
)

DEBUG = os.environ.get("DJANGO_DEBUG", "true").lower() != "false"

ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS", "*").split(",")

# ── Installed apps ────────────────────────────────────────────────
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "waitlist",
]

# ── Middleware ────────────────────────────────────────────────────
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "aaa_waitlist.urls"

# ── Templates ─────────────────────────────────────────────────────
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "aaa_waitlist.wsgi.application"

# ── Database ──────────────────────────────────────────────────────
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# ── Password validation ───────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ── Internationalisation ──────────────────────────────────────────
LANGUAGE_CODE = "en-gb"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# ── Static files ──────────────────────────────────────────────────
STATIC_URL = "/static/"
STATICFILES_DIRS = [BASE_DIR / "static"]
STATIC_ROOT = BASE_DIR / "staticfiles"  # for collectstatic in production

# ── Admin branding ────────────────────────────────────────────────
ADMIN_SITE_HEADER = "AnyAdviceApp Admin"
ADMIN_SITE_TITLE = "AAA Admin"
ADMIN_INDEX_TITLE = "Dashboard"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ── Email (Gmail SMTP) ────────────────────────────────────────────
# Set EMAIL_HOST_PASSWORD to a Gmail App Password in your environment.
# Steps: Google Account → Security → 2-Step Verification → App Passwords
EMAIL_BACKEND    = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST       = "smtp.gmail.com"
EMAIL_PORT       = 587
EMAIL_USE_TLS    = True
EMAIL_HOST_USER  = "theanyadviceapp@gmail.com"
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD", "")
DEFAULT_FROM_EMAIL  = "AnyAdviceApp <theanyadviceapp@gmail.com>"

# Base URL used in admin links inside notification emails
SITE_URL = os.environ.get("SITE_URL", "http://localhost:8000")
