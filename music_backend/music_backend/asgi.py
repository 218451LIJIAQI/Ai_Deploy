"""
ASGI Configuration for Moodify Music Backend

This file exposes the ASGI callable as a module-level variable named `application`.
ASGI (Asynchronous Server Gateway Interface) is used for deploying Django applications
with asynchronous capabilities and WebSocket support.

For more information on ASGI deployment, see:
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os
import dotenv

# Load environment variables from .env file for ASGI-based deployments
# This ensures configuration is available before Django initialization
dotenv.load_dotenv()

from django.core.asgi import get_asgi_application

# Set default Django settings module for ASGI application
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'music_backend.settings')

# Create and expose the ASGI application
# This callable is used by ASGI servers like Daphne, Uvicorn, or Hypercorn
application = get_asgi_application()
