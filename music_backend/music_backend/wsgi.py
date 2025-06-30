"""
WSGI Configuration for Moodify Music Backend

This module contains the WSGI application used by Django's development server
and any production WSGI deployments. It exposes a WSGI callable as a module-level
variable named `application`.

WSGI (Web Server Gateway Interface) is the standard for deploying Python web
applications with traditional synchronous web servers like Apache or Nginx.

For more information on WSGI and deployment, see:
https://docs.djangoproject.com/en/5.0/howto/deployment/wsgi/
"""

import os
import dotenv

# Load environment variables from .env file before Django initialization
# This ensures all configuration is available during the application startup
dotenv.load_dotenv()

from django.core.wsgi import get_wsgi_application

# Set the default Django settings module for the WSGI application
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'music_backend.settings')

# Create and expose the WSGI application
# This callable is used by WSGI servers like Gunicorn, uWSGI, or mod_wsgi
application = get_wsgi_application()
