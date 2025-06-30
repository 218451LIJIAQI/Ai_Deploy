"""
Main URL Configuration for Moodify Music Backend
Routes requests to appropriate Django apps and admin interface
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Django admin interface
    path('admin/', admin.site.urls),
    # Music app API endpoints
    path('', include('music.urls')),  # ✅ Correctly connect to music app routes
]
