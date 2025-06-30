#!/usr/bin/env python
"""
Database Population Script for Mood-Improvement Songs
Adds curated songs designed to improve user mood based on psychological principles
"""

import os
import sys
import django

# Configure Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'music_backend.settings')
django.setup()

from music.models import Mood, Song

def add_mood_improvement_songs():
    """
    Populate database with mood-improvement songs
    Songs are categorized by their therapeutic effect on different emotions
    """
    
    # Retrieve mood objects from database
    happy_mood = Mood.objects.get(name='Happy')
    calm_mood = Mood.objects.get(name='Calm')
    energetic_mood = Mood.objects.get(name='Energetic')
    party_mood = Mood.objects.get(name='Party')
    
    # Curated song collection for mood improvement therapy
    mood_improvement_songs = [
        # Happy songs - recommended for users feeling sad or down
        {
            'title': 'Happy',
            'artist': 'Pharrell Williams',
            'album': 'G I R L',
            'mood': happy_mood,
            'spotify_url': 'https://open.spotify.com/track/60nZcImufyMA1MKQY3dcCH',
        },
        {
            'title': 'Can\'t Stop the Feeling!',
            'artist': 'Justin Timberlake',
            'album': 'Trolls',
            'mood': happy_mood,
            'spotify_url': 'https://open.spotify.com/track/20I6sIOMTCkB6w7ryavxtO',
        },
        {
            'title': 'Walking on Sunshine',
            'artist': 'Katrina and the Waves',
            'album': 'Walking on Sunshine',
            'mood': happy_mood,
            'spotify_url': 'https://open.spotify.com/track/2q3rBKV48hJJrQc6JRPKjy',
        },
        {
            'title': 'Good as Hell',
            'artist': 'Lizzo',
            'album': 'Cuz I Love You',
            'mood': happy_mood,
            'spotify_url': 'https://open.spotify.com/track/6KJcoZtCLwNIbEGhSDKV8a',
        },
        
        # Calm songs - recommended for users feeling angry or anxious
        {
            'title': 'Breathe Me',
            'artist': 'Sia',
            'album': 'Colour the Small One',
            'mood': calm_mood,
            'spotify_url': 'https://open.spotify.com/track/4VdBDdmTGdhgW3FKrfj3QZ',
        },
        {
            'title': 'Mad World',
            'artist': 'Gary Jules',
            'album': 'Donnie Darko Soundtrack',
            'mood': calm_mood,
            'spotify_url': 'https://open.spotify.com/track/3JOVTQ5h8HGFnDdp4VT3MP',
        },
        {
            'title': 'River',
            'artist': 'Joni Mitchell',
            'album': 'Blue',
            'mood': calm_mood,
            'spotify_url': 'https://open.spotify.com/track/4Tj38fdBhSLCaYRqZAiXnA',
        },
        
        # Energetic songs - recommended for users feeling surprised or need stimulation
        {
            'title': 'Uptown Funk',
            'artist': 'Mark Ronson ft. Bruno Mars',
            'album': 'Uptown Special',
            'mood': energetic_mood,
            'spotify_url': 'https://open.spotify.com/track/32OlwWuMpZ6b0aN2RZOeMS',
        },
        {
            'title': 'Don\'t Stop Me Now',
            'artist': 'Queen',
            'album': 'Jazz',
            'mood': energetic_mood,
            'spotify_url': 'https://open.spotify.com/track/7hQJA50XrCWABAu5v6QZ4i',
        },
        
        # Party songs - recommended for users with neutral emotions
        {
            'title': 'I Gotta Feeling',
            'artist': 'Black Eyed Peas',
            'album': 'The E.N.D.',
            'mood': party_mood,
            'spotify_url': 'https://open.spotify.com/track/29l9eumG0WOVkzWBjCEcPt',
        },
        {
            'title': 'Party in the USA',
            'artist': 'Miley Cyrus',
            'album': 'The Time of Our Lives',
            'mood': party_mood,
            'spotify_url': 'https://open.spotify.com/track/5Q0Nhxo0l2bP3pNjpGJwV1',
        },
    ]
    
    # Add songs to database with duplicate checking
    created_count = 0
    for song_data in mood_improvement_songs:
        song, created = Song.objects.get_or_create(
            title=song_data['title'],
            artist=song_data['artist'],
            defaults={
                'album': song_data['album'],
                'mood': song_data['mood'],
                'spotify_url': song_data['spotify_url'],
            }
        )
        if created:
            created_count += 1
            print(f"Added song: {song.title} by {song.artist} -> {song.mood.name}")
        else:
            print(f"Song already exists: {song.title} by {song.artist}")
    
    # Display operation statistics
    print(f"\nOperation Statistics:")
    print(f"New songs added: {created_count}")
    print(f"Total songs in database: {Song.objects.count()}")
    
    # Display song distribution by mood
    for mood in Mood.objects.all():
        count = mood.songs.count()
        print(f"  {mood.name}: {count} songs")

if __name__ == '__main__':
    print("Starting mood-improvement songs database population...")
    print("=" * 50)
    add_mood_improvement_songs()
    print("=" * 50)
    print("Mood-improvement songs addition completed successfully!") 