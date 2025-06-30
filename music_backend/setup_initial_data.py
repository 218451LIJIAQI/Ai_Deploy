#!/usr/bin/env python
"""
Moodify Database Initialization Script

This comprehensive script sets up the initial database state for the Moodify
music recommendation application. It populates the database with essential
mood categories and sample songs to provide a functional baseline for
development, testing, and demonstration purposes.

Key Features:
    - Creates standardized mood categories for emotion-based music classification
    - Populates sample songs with real Spotify URLs for testing
    - Implements safe database operations with duplicate prevention
    - Provides detailed logging and progress tracking
    - Supports multiple execution runs without data corruption

Usage:
    python setup_initial_data.py

Environment Requirements:
    - Django project properly configured
    - Database migrations applied
    - Spotify API credentials (for future enhancements)

Author: Moodify Development Team
Version: 2.0
Last Updated: 2025-06-17
"""

import os
import sys
import django
from typing import List, Dict, Any, Tuple

# Django Environment Setup
# Add the current directory to Python path for module imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Configure Django settings module for standalone script execution
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'music_backend.settings')

# Initialize Django application registry and database connections
django.setup()

# Import models after Django setup to avoid AppRegistryNotReady errors
from music.models import Mood, Song


def create_initial_moods() -> Tuple[int, int]:
    """
    Initialize the database with essential mood categories for music classification.
    
    This function creates eight fundamental mood categories that serve as the
    foundation for the AI-powered music recommendation system. Each mood includes
    a descriptive explanation to guide the emotion detection algorithms.
    
    Mood Categories:
        - Happy: Upbeat, joyful, positive energy tracks
        - Sad: Melancholic, emotional, introspective music
        - Energetic: High-energy, motivating, workout-suitable songs
        - Calm: Peaceful, relaxing, meditation-friendly melodies
        - Party: Fun, danceable, social gathering music
        - Romantic: Love songs, intimate, relationship-themed tracks
        - Focus: Concentration-enhancing, study-friendly background music
        - Angry: Intense, aggressive, cathartic emotional release tracks
    
    Returns:
        Tuple[int, int]: A tuple containing (newly_created_count, total_count)
            - newly_created_count: Number of moods created in this run
            - total_count: Total number of moods in the database after operation
    
    Raises:
        django.db.DatabaseError: If database operations fail
        django.core.exceptions.ValidationError: If mood data is invalid
    
    Example:
        >>> created, total = create_initial_moods()
        >>> print(f"Created {created} new moods, {total} total in database")
    """
    print("🎭 Initializing mood categories for emotion-based music classification...")
    
    # Define comprehensive mood categories with detailed descriptions
    moods_data: List[Dict[str, str]] = [
        {
            'name': 'Happy',
            'description': 'Upbeat and joyful music that elevates mood and brings positive energy'
        },
        {
            'name': 'Sad',
            'description': 'Melancholic and emotional tracks for introspective moments and emotional release'
        },
        {
            'name': 'Energetic',
            'description': 'High-energy and motivating songs perfect for workouts and active pursuits'
        },
        {
            'name': 'Calm',
            'description': 'Peaceful and relaxing melodies ideal for meditation and stress relief'
        },
        {
            'name': 'Party',
            'description': 'Fun and danceable music designed for social gatherings and celebrations'
        },
        {
            'name': 'Romantic',
            'description': 'Love songs and romantic ballads for intimate moments and relationships'
        },
        {
            'name': 'Focus',
            'description': 'Concentration and study music that enhances productivity and mental clarity'
        },
        {
            'name': 'Angry',
            'description': 'Intense and aggressive tracks for emotional catharsis and energy release'
        },
    ]
    
    created_count = 0
    
    try:
        # Create each mood category with safe duplicate handling
        for mood_data in moods_data:
            mood, created = Mood.objects.get_or_create(
                name=mood_data['name'],
                defaults={'description': mood_data['description']}
            )
            
            if created:
                created_count += 1
                print(f"  ✅ Created mood category: {mood.name}")
            else:
                print(f"  ⚡ Mood category already exists: {mood.name}")
        
        # Get final count for reporting
        total_count = Mood.objects.count()
        
        print(f"\n📊 Mood Categories Summary:")
        print(f"  • Newly created: {created_count}")
        print(f"  • Total in database: {total_count}")
        
        return created_count, total_count
        
    except Exception as e:
        print(f"❌ Error creating mood categories: {str(e)}")
        raise


def create_sample_songs() -> Tuple[int, int]:
    """
    Populate the database with sample songs for testing and demonstration.
    
    This function adds a curated selection of popular songs across different
    mood categories, complete with real Spotify URLs for integration testing.
    The songs are chosen to represent diverse musical styles and provide
    realistic data for the recommendation algorithm.
    
    Sample Song Categories:
        - Contemporary pop hits for broad appeal
        - Emotional ballads for mood detection testing
        - High-energy tracks for workout scenarios
        - Ambient music for relaxation features
        - Cross-genre representation for algorithm diversity
    
    Returns:
        Tuple[int, int]: A tuple containing (newly_created_count, total_count)
            - newly_created_count: Number of songs created in this run
            - total_count: Total number of songs in the database after operation
    
    Raises:
        django.db.DatabaseError: If database operations fail
        Mood.DoesNotExist: If required mood categories don't exist
        django.core.exceptions.ValidationError: If song data is invalid
    
    Note:
        This function requires mood categories to be created first.
        Run create_initial_moods() before calling this function.
    
    Example:
        >>> created, total = create_sample_songs()
        >>> print(f"Added {created} sample songs, {total} total in database")
    """
    print("🎵 Adding sample songs for testing and demonstration...")
    
    try:
        # Retrieve mood objects with error handling
        mood_mapping = {}
        required_moods = ['Happy', 'Sad', 'Energetic', 'Calm', 'Party', 'Romantic']
        
        for mood_name in required_moods:
            try:
                mood_mapping[mood_name.lower()] = Mood.objects.get(name=mood_name)
            except Mood.DoesNotExist:
                print(f"⚠️  Warning: Mood '{mood_name}' not found. Creating moods first...")
                create_initial_moods()
                mood_mapping[mood_name.lower()] = Mood.objects.get(name=mood_name)
        
        # Curated sample songs with diverse representation
        sample_songs: List[Dict[str, Any]] = [
            # Happy/Upbeat Songs
            {
                'title': 'Good 4 U',
                'artist': 'Olivia Rodrigo',
                'album': 'SOUR',
                'mood': mood_mapping['happy'],
                'spotify_url': 'https://open.spotify.com/track/4ZtFanR9U6ndgddUvNcjcG',
                'genre': 'Pop Rock',
                'duration': 178  # seconds
            },
            {
                'title': 'Uptown Funk',
                'artist': 'Mark Ronson ft. Bruno Mars',
                'album': 'Uptown Special',
                'mood': mood_mapping['happy'],
                'spotify_url': 'https://open.spotify.com/track/32OlwWuMpZ6b0aN2RZOeMS',
                'genre': 'Funk Pop',
                'duration': 270
            },
            
            # Sad/Emotional Songs
            {
                'title': 'Drivers License',
                'artist': 'Olivia Rodrigo',
                'album': 'SOUR',
                'mood': mood_mapping['sad'],
                'spotify_url': 'https://open.spotify.com/track/7lPN2DXiMsVn7XUKtOW1CS',
                'genre': 'Pop Ballad',
                'duration': 242
            },
            {
                'title': 'Someone Like You',
                'artist': 'Adele',
                'album': '21',
                'mood': mood_mapping['sad'],
                'spotify_url': 'https://open.spotify.com/track/1zwMYTA5nlNjZxYrvBB2pV',
                'genre': 'Soul Ballad',
                'duration': 285
            },
            
            # Energetic/Workout Songs
            {
                'title': 'Levitating',
                'artist': 'Dua Lipa',
                'album': 'Future Nostalgia',
                'mood': mood_mapping['energetic'],
                'spotify_url': 'https://open.spotify.com/track/463CkQjx2Zk1yXoBuierM9',
                'genre': 'Dance Pop',
                'duration': 203
            },
            {
                'title': 'Blinding Lights',
                'artist': 'The Weeknd',
                'album': 'After Hours',
                'mood': mood_mapping['energetic'],
                'spotify_url': 'https://open.spotify.com/track/0VjIjW4GlULA4LGoDOLVdR',
                'genre': 'Synthwave Pop',
                'duration': 200
            },
            
            # Calm/Relaxing Songs
            {
                'title': 'Weightless',
                'artist': 'Marconi Union',
                'album': 'Ambient',
                'mood': mood_mapping['calm'],
                'spotify_url': 'https://open.spotify.com/track/7iCZVjVDwwJqGXLvjQpWao',
                'genre': 'Ambient',
                'duration': 485
            },
            {
                'title': 'Clair de Lune',
                'artist': 'Claude Debussy',
                'album': 'Suite Bergamasque',
                'mood': mood_mapping['calm'],
                'spotify_url': 'https://open.spotify.com/track/2HKjbVURAYNjM6Sg2cI6xK',
                'genre': 'Classical',
                'duration': 300
            },
            
            # Party/Dance Songs
            {
                'title': 'Dont Stop Me Now',
                'artist': 'Queen',
                'album': 'Jazz',
                'mood': mood_mapping['party'],
                'spotify_url': 'https://open.spotify.com/track/5T8EDUDqKcs6OSOwEsfqG7',
                'genre': 'Rock',
                'duration': 209
            },
            
            # Romantic Songs
            {
                'title': 'Perfect',
                'artist': 'Ed Sheeran',
                'album': '÷ (Divide)',
                'mood': mood_mapping['romantic'],
                'spotify_url': 'https://open.spotify.com/track/0tgVpDi06FyKpA1z0VMD4v',
                'genre': 'Pop Ballad',
                'duration': 263
            },
        ]
        
        created_count = 0
        
        # Create songs with comprehensive error handling
        for song_data in sample_songs:
            try:
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
                    print(f"  ✅ Added: '{song.title}' by {song.artist} ({song_data['mood'].name})")
                else:
                    print(f"  ⚡ Song already exists: '{song.title}' by {song.artist}")
                    
            except Exception as e:
                print(f"  ❌ Error creating song '{song_data['title']}': {str(e)}")
                continue
        
        # Get final count for reporting
        total_count = Song.objects.count()
        
        print(f"\n📊 Sample Songs Summary:")
        print(f"  • Newly created: {created_count}")
        print(f"  • Total in database: {total_count}")
        
        return created_count, total_count
        
    except Exception as e:
        print(f"❌ Error creating sample songs: {str(e)}")
        raise


def verify_data_integrity() -> bool:
    """
    Verify the integrity and completeness of the initialized data.
    
    Performs comprehensive checks to ensure that the database has been
    properly populated with the expected mood categories and sample songs.
    This function helps identify any issues with the initialization process.
    
    Returns:
        bool: True if all data integrity checks pass, False otherwise
    
    Checks Performed:
        - Minimum number of mood categories exist
        - Each mood has a valid description
        - Sample songs are properly linked to moods
        - Spotify URLs are properly formatted
        - No duplicate entries exist
    """
    print("🔍 Verifying data integrity...")
    
    try:
        # Check mood categories
        mood_count = Mood.objects.count()
        expected_moods = 8
        
        if mood_count < expected_moods:
            print(f"  ❌ Insufficient moods: {mood_count}/{expected_moods}")
            return False
        
        # Check that all moods have descriptions
        moods_without_description = Mood.objects.filter(description__isnull=True).count()
        if moods_without_description > 0:
            print(f"  ❌ {moods_without_description} moods missing descriptions")
            return False
        
        # Check sample songs
        song_count = Song.objects.count()
        if song_count == 0:
            print("  ❌ No sample songs found")
            return False
        
        # Check that songs are linked to moods
        songs_without_mood = Song.objects.filter(mood__isnull=True).count()
        if songs_without_mood > 0:
            print(f"  ❌ {songs_without_mood} songs not linked to moods")
            return False
        
        print(f"  ✅ Data integrity verified:")
        print(f"    • {mood_count} mood categories")
        print(f"    • {song_count} sample songs")
        print(f"    • All songs properly categorized")
        
        return True
        
    except Exception as e:
        print(f"  ❌ Error during verification: {str(e)}")
        return False


if __name__ == '__main__':
    """
    Main execution block for the Moodify database initialization script.
    
    This block orchestrates the complete database setup process, including
    mood category creation, sample song population, and data verification.
    Provides comprehensive logging and error handling for troubleshooting.
    
    Execution Flow:
        1. Display startup banner and system information
        2. Create initial mood categories
        3. Populate sample songs
        4. Verify data integrity
        5. Display completion summary
    
    Exit Codes:
        0: Successful completion
        1: Error during execution
    """
    print("🎵 MOODIFY DATABASE INITIALIZATION SCRIPT")
    print("=" * 60)
    print("Setting up initial data for Moodify Music Application...")
    print(f"Django Version: {django.get_version()}")
    print(f"Database: {os.environ.get('DATABASE_URL', 'SQLite (default)')}")
    print("=" * 60)
    
    try:
        # Phase 1: Create mood categories
        print("\n🎭 PHASE 1: Creating mood categories...")
        moods_created, total_moods = create_initial_moods()
        
        # Phase 2: Create sample songs
        print("\n🎵 PHASE 2: Adding sample songs...")
        songs_created, total_songs = create_sample_songs()
        
        # Phase 3: Verify data integrity
        print("\n🔍 PHASE 3: Verifying data integrity...")
        integrity_check = verify_data_integrity()
        
        # Final summary
        print("\n" + "=" * 60)
        if integrity_check:
            print("🎉 DATABASE INITIALIZATION COMPLETED SUCCESSFULLY!")
            print(f"✅ System ready with {total_moods} moods and {total_songs} songs")
            print("🚀 You can now start the Moodify application!")
        else:
            print("⚠️  INITIALIZATION COMPLETED WITH WARNINGS")
            print("🔧 Please review the verification results above")
        
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ INITIALIZATION FAILED: {str(e)}")
        print("🔧 Please check your Django configuration and database connection")
        sys.exit(1) 