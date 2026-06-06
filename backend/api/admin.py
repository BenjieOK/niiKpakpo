from django.contrib import admin
from .models import HeroSlide, ExpertiseCard, Project, TimelineEntry, BlogPost, ContactMessage, SiteSettings


@admin.register(HeroSlide)
class HeroSlideAdmin(admin.ModelAdmin):
    list_display = ['headline', 'order', 'is_active']
    list_editable = ['order', 'is_active']


@admin.register(ExpertiseCard)
class ExpertiseCardAdmin(admin.ModelAdmin):
    list_display = ['title', 'order']
    list_editable = ['order']


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'status', 'order', 'is_active']
    list_editable = ['status', 'order', 'is_active']


@admin.register(TimelineEntry)
class TimelineAdmin(admin.ModelAdmin):
    list_display = ['degree', 'institution', 'order']
    list_editable = ['order']


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'date', 'is_featured', 'is_published']
    list_editable = ['is_featured', 'is_published']
    list_filter = ['category', 'is_published']


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'created_at', 'is_read']
    list_filter = ['is_read']
    readonly_fields = ['name', 'email', 'subject', 'message', 'created_at']


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()
