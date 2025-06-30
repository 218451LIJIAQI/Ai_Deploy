"""
Django Test Suite for Moodify Music API
Comprehensive tests for mood detection and music recommendation endpoints
"""

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Mood, Song


class MoodifyAPITests(APITestCase):
    """
    Test suite for Moodify API endpoints
    Tests mood management, song retrieval, and mood detection functionality
    """

    def setUp(self):
        """
        Set up test data before each test method
        Creates sample moods and songs for testing
        """
        self.happy_mood = Mood.objects.create(name="Happy")
        self.sad_mood = Mood.objects.create(name="Sad")
        Song.objects.create(title="Happy Song", artist="Artist1", mood=self.happy_mood)
        Song.objects.create(title="Sad Song", artist="Artist2", mood=self.sad_mood)

    def test_get_moods(self):
        """
        Test mood list retrieval endpoint
        Verifies that all moods are returned correctly
        """
        url = reverse("get_moods")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["name"], "Happy")

    def test_get_songs_by_mood_valid(self):
        """
        Test song retrieval by valid mood
        Verifies correct songs are returned for existing mood
        """
        url = reverse("get_songs_by_mood")
        response = self.client.get(url, {"mood": "happy"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Happy Song")

    def test_get_songs_by_mood_invalid(self):
        """
        Test song retrieval by invalid mood
        Verifies proper error handling for non-existent moods
        """
        url = reverse("get_songs_by_mood")
        response = self.client.get(url, {"mood": "angry"})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_detect_mood_from_text(self):
        """
        Test text-based mood detection endpoint
        Verifies AI mood detection from text input
        """
        url = reverse("detect_text_mood")
        response = self.client.post(url, {"text": "I am feeling awesome today!"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("mood", response.data)
