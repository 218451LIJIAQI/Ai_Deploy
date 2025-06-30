"""
Django Admin Configuration for Moodify Music Application

This module configures the Django admin interface for managing music-related models.
Provides customized admin views for Profile, Mood, Song, and UserMood models.
"""

from django.contrib import admin
from .models import Profile, Mood, Song, UserMood


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    """
    Admin configuration for Profile model.
    
    Provides interface for managing user profiles with mood preferences.
    Includes search and filtering capabilities for better user management.
    """
    list_display = ('user', 'favorite_mood')
    search_fields = ('user__username',)
    list_filter = ('favorite_mood',)


@admin.register(Mood)
class MoodAdmin(admin.ModelAdmin):
    """
    Admin configuration for Mood model.
    
    Manages mood categories used for music classification.
    Provides search functionality and alphabetical ordering.
    """
    list_display = ('name', 'description')
    search_fields = ('name',)
    ordering = ('name',)


@admin.register(Song)
class SongAdmin(admin.ModelAdmin):
    """
    Admin configuration for Song model.
    
    Manages the music library with mood-based categorization.
    Includes filtering by mood and search by title/artist.
    """
    list_display = ('title', 'artist', 'mood', 'spotify_url')
    list_filter = ('mood',)
    search_fields = ('title', 'artist')
    ordering = ('title',)


@admin.register(UserMood)
class UserMoodAdmin(admin.ModelAdmin):
    """
    Admin configuration for UserMood model.
    
    Tracks user mood history and interactions.
    Provides chronological ordering and filtering capabilities.
    """
    list_display = ('user', 'mood', 'timestamp')
    list_filter = ('mood', 'timestamp')
    search_fields = ('user__username',)
    ordering = ('-timestamp',)
