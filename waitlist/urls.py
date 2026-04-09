from django.urls import path
from . import views

urlpatterns = [
    # Pages
    path("",           views.index,       name="index"),
    path("careers/",   views.careers,     name="careers"),
    path("privacy/",   views.privacy,     name="privacy"),
    path("terms/",     views.terms,       name="terms"),
    path("contact/",   views.contact,     name="contact"),

    # API
    path("api/stats",    views.stats,       name="api-stats"),
    path("api/register", views.register,    name="api-register"),
    path("api/survey",   views.survey,      name="api-survey"),
    path("api/contact",  views.contact_api, name="api-contact"),
]
