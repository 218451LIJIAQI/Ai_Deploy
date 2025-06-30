#!/usr/bin/env python
"""
Django Management Script for Moodify Music Backend

This is Django's command-line utility for administrative tasks including:
- Database migrations (migrate, makemigrations)
- Running the development server (runserver)
- Creating superusers (createsuperuser)
- Running custom management commands (populate_db)
- Collecting static files (collectstatic)

The script automatically loads environment variables from .env files
and provides enhanced error handling for common Django setup issues.

Usage:
    python manage.py <command> [options]

Common Commands:
    python manage.py runserver          # Start development server
    python manage.py migrate            # Apply database migrations
    python manage.py createsuperuser    # Create admin user
    python manage.py populate_db        # Initialize database with sample data

Requirements:
    - Django framework
    - python-dotenv (optional, for .env file support)
"""

import os
import sys

# Attempt to load environment variables from .env file
try:
    import dotenv
    dotenv.load_dotenv()  # Load environment variables from .env file
    print("✓ Environment variables loaded from .env file")
except ImportError:
    # Graceful fallback if dotenv is not installed
    print("⚠ Warning: python-dotenv is not installed. Environment variables from .env won't be loaded.")
    print("  Install with: pip install python-dotenv")


def main():
    """
    Run Django administrative tasks.
    
    Sets up the Django environment and executes command-line operations.
    Provides enhanced error messages for common setup issues.
    
    Raises:
        ImportError: If Django is not properly installed or configured
        SystemExit: If command execution fails
    """
    # Set default Django settings module
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'music_backend.settings')

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        # Enhanced error message with troubleshooting tips
        error_msg = (
            "❌ Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? "
            "\n\nTroubleshooting steps:"
            "\n1. Check if Django is installed: pip show django"
            "\n2. Activate your virtual environment if using one"
            "\n3. Install Django: pip install django"
            "\n4. Verify your Python path and working directory"
        )
        raise ImportError(error_msg) from exc

    # Execute the command-line operation
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
