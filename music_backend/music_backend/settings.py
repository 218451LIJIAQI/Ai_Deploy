"""
Django settings for Moodify Music Backend
Production-ready configuration with environment variable support
Includes security settings, CORS configuration, and database setup
"""

import os
from pathlib import Path
from django.core.management.utils import get_random_secret_key

try:
    import dj_database_url       # For PostgreSQL URL parsing
    import dotenv                # For environment variable loading
except ImportError:
    dj_database_url = None
    dotenv = None

# Build paths inside the project
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from .env file if available
if dotenv:
    dotenv.load_dotenv(BASE_DIR / '.env')

# Security Configuration
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", get_random_secret_key())

# Debug and Host Configuration
DEBUG = os.getenv("DJANGO_DEBUG", "True") == "True"
ALLOWED_HOSTS = ["localhost", "127.0.0.1", "ai-deploy-2.onrender.com"]

# Application Definition
INSTALLED_APPS = [
    "django.contrib.admin",
     "django.contrib.auth",
     "django.contrib.contenttypes",
     "django.contrib.sessions",
     "django.contrib.messages",
     "django.contrib.staticfiles",
     # Third-party packages
     "corsheaders",
     "rest_framework",
     "rest_framework.authtoken",
    # Local applications
    "music",          # Main music recommendation app
]

# Middleware Configuration
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",  # CORS handling before CommonMiddleware
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "music_backend.urls"

# Template Configuration
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "music_backend.wsgi.application"

# Database Configuration
# Supports both PostgreSQL (production) and SQLite (development)

DEFAULT_DB = {
    "ENGINE": "django.db.backends.sqlite3",
    "NAME": BASE_DIR / "db.sqlite3",
}

# Check for DATABASE_URL environment variable for PostgreSQL
database_url = os.getenv("DATABASE_URL", None)

if database_url and dj_database_url:
    # Use PostgreSQL from environment variable
    DATABASES = {
        "default": dj_database_url.config(
            default=database_url,
            conn_max_age=600
        )
    }
else:
    # Fall back to SQLite for development
    DATABASES = {
        "default": DEFAULT_DB
    }
    if not database_url:
        print("Using SQLite database for development")
    else:
        print("dj_database_url not available, falling back to SQLite")

# Password Validation
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# Internationalization
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kuala_Lumpur"
USE_I18N = True
USE_TZ = True

# Static Files Configuration
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

# Default Primary Key Field Type
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# CORS Configuration for Frontend Integration
CORS_ALLOWED_ORIGINS = os.getenv(
    "CORS_ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000"
).split(",")

# Additional CORS settings for development
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = os.getenv("DJANGO_DEBUG", "True") == "True"  # Only in development

# CORS headers configuration
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Django REST Framework Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',  # Allow unauthenticated access by default
    ],
}

# Authentication Configuration
LOGIN_URL = '/api/auth/login/'
LOGIN_REDIRECT_URL = '/'
