from django.db import models


class Registration(models.Model):
    first_name = models.CharField(max_length=100)
    last_name  = models.CharField(max_length=100)
    email      = models.EmailField(unique=True)
    phone      = models.CharField(max_length=30, blank=True)
    consent    = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Registration"
        verbose_name_plural = "Registrations"

    def __str__(self):
        return f"{self.first_name} {self.last_name} <{self.email}>"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"


PAYMENT_CHOICES = [
    ("free_only",    "Free only"),
    ("freemium",     "Freemium"),
    ("subscription", "Monthly subscription"),
    ("per_session",  "Pay per session"),
]

AGE_CHOICES = [
    ("under18", "Under 18"),
    ("18-24",   "18 – 24"),
    ("25-34",   "25 – 34"),
    ("35-44",   "35 – 44"),
    ("45-54",   "45 – 54"),
    ("55+",     "55+"),
]


class Survey(models.Model):
    registration       = models.OneToOneField(
        Registration,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="survey",
    )
    email              = models.EmailField(blank=True)
    # Stored as comma-separated values e.g. "individual,couples,anxiety"
    counselling_types  = models.CharField(max_length=500, blank=True)
    payment_preference = models.CharField(max_length=20, choices=PAYMENT_CHOICES, blank=True)
    price_willingness  = models.CharField(max_length=10, blank=True)  # £ amount
    age_range          = models.CharField(max_length=10, choices=AGE_CHOICES, blank=True)
    sources            = models.CharField(max_length=200, blank=True)  # comma-separated
    extra_notes        = models.TextField(blank=True)
    created_at         = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Survey Response"
        verbose_name_plural = "Survey Responses"

    def __str__(self):
        return f"Survey — {self.email or 'anonymous'} ({self.created_at:%Y-%m-%d})"

    def counselling_list(self):
        return self.counselling_types.replace(",", ", ") if self.counselling_types else "—"
    counselling_list.short_description = "Counselling interests"

    def sources_list(self):
        return self.sources.replace(",", ", ") if self.sources else "—"
    sources_list.short_description = "Heard via"
