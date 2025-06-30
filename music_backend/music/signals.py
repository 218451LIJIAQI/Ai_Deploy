"""
Django Signal Handlers for Moodify Music Application

This module contains signal handlers that automatically respond to Django model events.
Manages user profile creation and updates when User model instances are saved.
"""

from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import Profile


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Signal handler to create a Profile when a new User is created.
    
    This function is automatically called after a User instance is saved.
    Creates a corresponding Profile instance for new users to maintain
    a one-to-one relationship between User and Profile models.
    
    Args:
        sender (Model): The model class that sent the signal (User)
        instance (User): The actual User instance being saved
        created (bool): True if a new record was created
        **kwargs: Additional keyword arguments from the signal
    """
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """
    Signal handler to save the Profile when a User is updated.
    
    This function ensures that the associated Profile is saved
    whenever the User instance is updated, maintaining data consistency.
    
    Args:
        sender (Model): The model class that sent the signal (User)
        instance (User): The actual User instance being saved
        **kwargs: Additional keyword arguments from the signal
    """
    instance.profile.save()
