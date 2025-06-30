"""
Django App Configuration for Moodify Music Module

This module defines the configuration for the music application within the Django project.
Handles app initialization, signal registration, and module-level settings.
"""

from django.apps import AppConfig


class MusicConfig(AppConfig):
    """
    Configuration class for the Moodify Music application.
    
    Defines app-level settings including database field types, app name,
    and initialization procedures. Registers signal handlers on app startup.
    
    Attributes:
        default_auto_field (str): Default primary key field type for models
        name (str): Python path to the application module
        verbose_name (str): Human-readable name for the application
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'music'
    verbose_name = '🎵 Moodify Music Module'

    def ready(self):
        """
        Called when the app is loaded and ready.
        
        Used to register signal handlers and perform any startup initialization.
        Imports the signals module to ensure signal handlers are registered.
        """
        import music.signals  # noqa: F401
