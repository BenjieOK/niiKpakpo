from django.db import models


class HeroSlide(models.Model):
    STYLE_CHOICES = [('primary', 'Primary'), ('accent', 'Accent'), ('secondary', 'Secondary')]
    headline = models.CharField(max_length=200)
    subtitle = models.TextField()
    button_text = models.CharField(max_length=100)
    button_url = models.CharField(max_length=200, default='#')
    button_style = models.CharField(max_length=20, choices=STYLE_CHOICES, default='primary')
    background_image = models.URLField(blank=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.headline


class ExpertiseCard(models.Model):
    icon = models.CharField(max_length=100, help_text="FontAwesome class e.g. fas fa-ship")
    title = models.CharField(max_length=100)
    description = models.TextField()
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title


class Project(models.Model):
    STATUS_CHOICES = [('completed', 'Completed'), ('ongoing', 'Ongoing')]
    title = models.CharField(max_length=200)
    description = models.TextField()
    image_url = models.URLField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ongoing')
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title


class TimelineEntry(models.Model):
    degree = models.CharField(max_length=200)
    institution = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.degree} — {self.institution}"


class BlogCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    icon = models.CharField(max_length=100, default='fas fa-tag', help_text='FontAwesome class')
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']
        verbose_name_plural = 'Blog Categories'

    def __str__(self):
        return self.name


class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100, default='Edgar Nii Kpakpo Addo')
    category = models.CharField(max_length=50)
    summary = models.TextField()
    content = models.TextField()
    date = models.DateField(auto_now_add=True)
    image_url = models.URLField(blank=True)
    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return self.title


class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} — {self.subject}"


class SiteSettings(models.Model):
    contact_email = models.EmailField(default='contact@niikpakpo.com')
    location = models.CharField(max_length=200, default='Accra, Ghana')
    twitter_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    facebook_url = models.URLField(blank=True)
    home_about_image = models.TextField(blank=True, default='')
    home_about_title = models.CharField(max_length=200, default='About Edgar Nii Kpakpo Addo')
    home_about_p1 = models.TextField(
        default='Edgar Nii Kpakpo Addo is a distinguished Maritime Education Practitioner, Certified Engineer, and Entrepreneur with a passion for shaping the future of the TVET, maritime, and oil & gas industries. With a career spanning over two decades, he bridges academic excellence with real-world impact.'
    )
    home_about_p2 = models.TextField(
        default="As a lecturer at the Regional Maritime University and a consultant for international institutions, he is a driving force behind competency-based technical and vocational training in Ghana. His mission is to make hands-on technical education the catalyst for Ghana's economic transformation."
    )
    quote_banner = models.TextField(
        default="My mission is simple: make hands-on technical education the driving force of Ghana's economic transformation."
    )
    cta_title = models.CharField(max_length=200, default='Join the Vision')
    cta_body = models.TextField(
        default="Let's connect and explore opportunities for collaboration, growth, and transforming Ghana's technical education landscape together."
    )

    class Meta:
        verbose_name = 'Site Settings'
        verbose_name_plural = 'Site Settings'

    def __str__(self):
        return 'Site Settings'

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj
