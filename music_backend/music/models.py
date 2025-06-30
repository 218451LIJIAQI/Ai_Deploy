"""
Django Models for Moodify Music Recommendation System
Defines database structure for moods, songs, user profiles, and mood logging
"""

from django.db import models
from django.contrib.auth.models import User


class Mood(models.Model):
    """
    Music mood/genre classification model
    Stores available mood categories for music recommendations
    """
    name: str = models.CharField(max_length=50, unique=True)
    description: str = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Mood"
        verbose_name_plural = "Moods"
        ordering = ['name']

    def __str__(self) -> str:
        return self.name


class Song(models.Model):
    """
    Song model with Spotify integration
    Stores song metadata and links to mood classifications
    """
    title: str = models.CharField(max_length=100)
    artist: str = models.CharField(max_length=100)
    album: str = models.CharField(max_length=100, blank=True, null=True)

    # Foreign key relationship to mood with cascade protection
    mood = models.ForeignKey(
        Mood,
        on_delete=models.SET_NULL,
        null=True,
        related_name="songs"
    )

    # Spotify API integration fields
    spotify_url = models.URLField(max_length=200, blank=True, null=True)
    preview_url = models.URLField(max_length=200, blank=True, null=True)
    cover_image_url = models.URLField(max_length=200, blank=True, null=True)

    class Meta:
        verbose_name = "Song"
        verbose_name_plural = "Songs"
        ordering = ['title']

    def __str__(self) -> str:
        return f"{self.title} by {self.artist}"


class Profile(models.Model):
    """
    Extended user profile model
    Stores user preferences including favorite mood
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    favorite_mood = models.ForeignKey(
        Mood,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="favorited_by"
    )

    class Meta:
        verbose_name = "User Profile"
        verbose_name_plural = "User Profiles"

    def __str__(self) -> str:
        return self.user.username


class UserMood(models.Model):
    """
    User mood history tracking model
    Logs user mood selections for analytics and personalized recommendations
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="mood_logs")
    mood = models.ForeignKey(Mood, on_delete=models.CASCADE, related_name="user_logs")
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "User Mood Log"
        verbose_name_plural = "User Mood Logs"
        ordering = ['-timestamp']  # Most recent first

    def __str__(self) -> str:
        return f"{self.user.username} was {self.mood.name} on {self.timestamp.strftime('%Y-%m-%d %H:%M')}"
