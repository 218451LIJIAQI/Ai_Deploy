"""
Django Management Command for Database Population

This module defines a custom Django management command to populate the database
with initial mood and song data. Can be run using 'python manage.py populate_db'.
"""

from django.core.management.base import BaseCommand
from music.models import Mood, Song


class Command(BaseCommand):
    """
    Django management command to populate database with initial data.
    
    This command creates basic mood categories and sample songs for each mood.
    Designed to be run during initial setup or for resetting test data.
    
    Usage:
        python manage.py populate_db
    
    Attributes:
        help (str): Description shown in Django management command help
    """
    help = 'Populate the database with initial mood and song data'

    def handle(self, *args, **kwargs):
        """
        Main execution method for the management command.
        
        Creates mood categories and sample songs, providing console output
        for each item created. Uses get_or_create to avoid duplicates.
        
        Args:
            *args: Positional arguments (unused)
            **kwargs: Keyword arguments from command line options
            
        Returns:
            None
        """
        # Create mood categories
        moods = ['Happy', 'Sad', 'Energetic', 'Calm']
        for mood_name in moods:
            mood, created = Mood.objects.get_or_create(name=mood_name)
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Created mood: {mood_name}')
                )

        # Create sample songs for each mood category
        songs = [
            {'title': 'Happy Song', 'artist': 'Artist1', 'mood': 'Happy'},
            {'title': 'Sad Song', 'artist': 'Artist2', 'mood': 'Sad'},
            {'title': 'Energetic Song', 'artist': 'Artist3', 'mood': 'Energetic'},
            {'title': 'Calm Song', 'artist': 'Artist4', 'mood': 'Calm'},
        ]

        for song_data in songs:
            mood = Mood.objects.get(name=song_data['mood'])
            song, created = Song.objects.get_or_create(
                title=song_data['title'],
                artist=song_data['artist'],
                mood=mood
            )
            if created:
                self.stdout.write(
                    self.style.SUCCESS(
                        f'Added song: {song.title} by {song.artist}'
                    )
                )
