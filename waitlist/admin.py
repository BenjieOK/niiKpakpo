from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Count
from django.http import HttpResponse
import csv

from .models import Registration, Survey


# ── CSV export action ─────────────────────────────────────────────

def export_registrations_csv(modeladmin, request, queryset):
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = 'attachment; filename="registrations.csv"'
    writer = csv.writer(response)
    writer.writerow(["ID", "First Name", "Last Name", "Email", "Phone", "Consent", "Registered At"])
    for r in queryset.order_by("created_at"):
        writer.writerow([r.id, r.first_name, r.last_name, r.email, r.phone, r.consent, r.created_at])
    return response

export_registrations_csv.short_description = "Export selected to CSV"


def export_surveys_csv(modeladmin, request, queryset):
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = 'attachment; filename="surveys.csv"'
    writer = csv.writer(response)
    writer.writerow([
        "ID", "Email", "Counselling Types", "Payment Preference",
        "Price Willingness (£)", "Age Range", "Sources", "Extra Notes", "Submitted At",
    ])
    for s in queryset.order_by("created_at"):
        writer.writerow([
            s.id, s.email, s.counselling_types, s.get_payment_preference_display(),
            s.price_willingness, s.get_age_range_display(), s.sources, s.extra_notes, s.created_at,
        ])
    return response

export_surveys_csv.short_description = "Export selected to CSV"


# ── Survey inline (shown inside Registration detail) ─────────────

class SurveyInline(admin.StackedInline):
    model = Survey
    extra = 0
    can_delete = False
    readonly_fields = [
        "email", "counselling_list", "payment_preference", "price_willingness",
        "age_range", "sources_list", "extra_notes", "created_at",
    ]
    fields = readonly_fields
    verbose_name = "Survey Response"

    def has_add_permission(self, request, obj=None):
        return False


# ── Registration admin ────────────────────────────────────────────

@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    list_display  = ["id", "full_name", "email", "phone", "consent_badge", "has_survey", "created_at"]
    list_filter   = ["consent", "created_at"]
    search_fields = ["first_name", "last_name", "email", "phone"]
    date_hierarchy = "created_at"
    readonly_fields = ["created_at"]
    ordering = ["-created_at"]
    inlines = [SurveyInline]
    actions = [export_registrations_csv]

    fieldsets = [
        ("Personal Details", {
            "fields": ["first_name", "last_name", "email", "phone"],
        }),
        ("Registration Info", {
            "fields": ["consent", "created_at"],
        }),
    ]

    @admin.display(description="Name")
    def full_name(self, obj):
        return obj.full_name

    @admin.display(description="Consent", boolean=False)
    def consent_badge(self, obj):
        if obj.consent:
            return format_html('<span style="color:#16a34a;font-weight:600;">{}</span>', "✓ Yes")
        return format_html('<span style="color:#dc2626;">{}</span>', "✗ No")

    @admin.display(description="Survey", boolean=True)
    def has_survey(self, obj):
        return hasattr(obj, "survey")

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related("survey")


# ── Survey admin ──────────────────────────────────────────────────

@admin.register(Survey)
class SurveyAdmin(admin.ModelAdmin):
    list_display  = [
        "id", "email", "counselling_list", "payment_preference",
        "price_willingness_display", "age_range", "sources_list", "created_at",
    ]
    list_filter   = ["payment_preference", "age_range", "created_at"]
    search_fields = ["email", "extra_notes"]
    date_hierarchy = "created_at"
    readonly_fields = [
        "registration", "email", "counselling_list", "payment_preference",
        "price_willingness", "age_range", "sources_list", "extra_notes", "created_at",
    ]
    ordering = ["-created_at"]
    actions = [export_surveys_csv]

    fieldsets = [
        ("Respondent", {
            "fields": ["registration", "email"],
        }),
        ("Counselling Preferences", {
            "fields": ["counselling_list", "payment_preference", "price_willingness", "age_range"],
        }),
        ("Additional Info", {
            "fields": ["sources_list", "extra_notes", "created_at"],
        }),
    ]

    @admin.display(description="Price Willingness")
    def price_willingness_display(self, obj):
        return f"£{obj.price_willingness}" if obj.price_willingness else "—"
