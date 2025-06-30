"""
Django REST Framework Serializers for Moodify API
Handles serialization of model data for API responses
"""

from rest_framework import serializers
from .models import Mood, Song


class MoodSerializer(serializers.ModelSerializer):
    """
    Serializer for Mood model
    Converts mood data to JSON format for API responses
    """
    class Meta:
        model = Mood
        fields: str = '__all__'


class SongSerializer(serializers.ModelSerializer):
    """
    Serializer for Song model
    Includes related mood information and all song fields
    """
    # Display mood name instead of ID for better readability
    mood = serializers.StringRelatedField()

    class Meta:
        model = Song
        fields: str = '__all__'
