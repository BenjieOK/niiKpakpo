from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('hero-slides', views.HeroSlideViewSet, basename='heroslide')
router.register('expertise-cards', views.ExpertiseCardViewSet, basename='expertisecard')
router.register('projects', views.ProjectViewSet, basename='project')
router.register('timeline', views.TimelineEntryViewSet, basename='timeline')
router.register('blog-posts', views.BlogPostViewSet, basename='blogpost')
router.register('categories', views.BlogCategoryViewSet, basename='category')
router.register('messages', views.ContactMessageViewSet, basename='message')
router.register('users', views.UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('settings/', views.site_settings, name='site-settings'),
    path('messages/<int:pk>/read/', views.mark_message_read, name='mark-read'),
    path('admin-stats/', views.admin_stats, name='admin-stats'),
]
