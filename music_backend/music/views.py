"""
Django REST API Views for Moodify Music Recommendation System
Handles user authentication, mood detection, and music recommendations
"""

from __future__ import annotations

from django.http import HttpRequest
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from textblob import TextBlob

import numpy as np
import cv2
import traceback
import logging

from .models import Song, Mood, Profile, UserMood
from .serializers import MoodSerializer, SongSerializer

# Configure logging for debugging
logger = logging.getLogger(__name__)

# User Authentication Views

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    User registration endpoint
    Creates new user account with validation and generates authentication token
    """
    try:
        data = request.data
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()
        
        # Input validation
        if not username or not email or not password:
            return Response({
                'success': False,
                'message': 'Username, email and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if len(password) < 6:
            return Response({
                'success': False,
                'message': 'Password must be at least 6 characters long'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check for existing users
        if User.objects.filter(username=username).exists():
            return Response({
                'success': False,
                'message': 'Username already exists'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(email=email).exists():
            return Response({
                'success': False,
                'message': 'Email already registered'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create new user and profile
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        
        Profile.objects.get_or_create(user=user)
        
        # Generate authentication token
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'success': True,
            'message': 'Registration successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            },
            'token': token.key
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        return Response({
            'success': False,
            'message': 'Registration failed. Please try again.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """
    User login endpoint
    Authenticates user credentials and returns authentication token
    """
    try:
        data = request.data
        username = data.get('username', '').strip()
        password = data.get('password', '').strip()
        
        if not username or not password:
            return Response({
                'success': False,
                'message': 'Username and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Authenticate user credentials
        user = authenticate(username=username, password=password)
        
        if user is not None:
            if user.is_active:
                login(request, user)
                
                # Get or create authentication token
                token, created = Token.objects.get_or_create(user=user)
                
                return Response({
                    'success': True,
                    'message': 'Login successful',
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email
                    },
                    'token': token.key
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'success': False,
                    'message': 'Account is disabled'
                }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({
                'success': False,
                'message': 'Invalid username or password'
            }, status=status.HTTP_401_UNAUTHORIZED)
            
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return Response({
            'success': False,
            'message': 'Login failed. Please try again.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    """
    User logout endpoint
    Invalidates authentication token and logs out user
    """
    try:
        # Delete the user's authentication token
        if hasattr(request.user, 'auth_token'):
            request.user.auth_token.delete()
        
        logout(request)
        
        return Response({
            'success': True,
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Logout error: {str(e)}")
        return Response({
            'success': False,
            'message': 'Logout failed'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_auth(request):
    """
    Authentication status check endpoint
    Returns current user information if authenticated
    """
    try:
        user = request.user
        return Response({
            'success': True,
            'authenticated': True,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Auth check error: {str(e)}")
        return Response({
            'success': False,
            'authenticated': False,
            'message': 'Authentication check failed'
        }, status=status.HTTP_401_UNAUTHORIZED)

# ---------------------------------------------------------------------------
# 🎵 Music API Views (Existing functionality preserved)
# ---------------------------------------------------------------------------

MOOD_MAP: list[tuple[float, str]] = [
    (0.3, "Happy"),
    (0.1, "Energetic"),
    (0.0, "Calm"),
    (-0.1, "Sad"),
]

def polarity_to_mood(polarity: float) -> str:
    for threshold, label in MOOD_MAP:
        if polarity >= threshold:
            return label
    return "Party"


@api_view(["GET"])
@permission_classes([AllowAny])  # Keep existing endpoints accessible without auth
def get_moods(_: HttpRequest) -> Response:
    """Return all available mood labels"""
    moods = Mood.objects.all()
    serializer = MoodSerializer(moods, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([AllowAny])  # Keep existing endpoints accessible without auth
def get_songs_by_mood(request: HttpRequest) -> Response:
    """Return corresponding song list based on mood name"""
    mood_name = request.GET.get("mood", "").strip()
    if not mood_name:
        return Response({"error": "Missing 'mood' query parameter."},
                        status=status.HTTP_400_BAD_REQUEST)

    mood = Mood.objects.filter(name__iexact=mood_name).first()
    if not mood:
        return Response({"error": "Mood not found."},
                        status=status.HTTP_404_NOT_FOUND)

    songs = Song.objects.filter(mood=mood)
    serializer = SongSerializer(songs, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])  # Keep existing endpoints accessible without auth
def detect_mood_from_text(request: HttpRequest) -> Response:
    """Use TextBlob to analyze text sentiment"""
    user_text: str = request.data.get("text", "").strip()
    if not user_text:
        return Response({"error": "No text provided."},
                        status=status.HTTP_400_BAD_REQUEST)

    try:
        polarity = TextBlob(user_text).sentiment.polarity
        detected_mood = polarity_to_mood(polarity)
        return Response({"mood": detected_mood, "polarity": polarity},
                        status=status.HTTP_200_OK)
    except Exception as exc:
        return Response({"error": str(exc)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
@permission_classes([AllowAny])  # Keep existing endpoints accessible without auth
def detect_mood_from_image(request: HttpRequest) -> Response:
    """Use FER to analyze emotions in uploaded images"""
    if 'image' not in request.FILES:
        return Response({'error': 'No image uploaded.'},
                        status=status.HTTP_400_BAD_REQUEST)

    try:
        from fer import FER  # ✅ Delayed import to avoid startup errors

        image_file = request.FILES['image']
        img_array = np.frombuffer(image_file.read(), np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

        if img is None:
            return Response({'error': 'Invalid image file.'},
                            status=status.HTTP_400_BAD_REQUEST)

        detector = FER(mtcnn=True)
        results = detector.detect_emotions(img)

        if not results:
            return Response({'error': 'No face or emotion detected.'},
                            status=status.HTTP_400_BAD_REQUEST)

        top_emotions = results[0]["emotions"]
        dominant_emotion = max(top_emotions, key=top_emotions.get)

        return Response({"emotion": dominant_emotion}, status=status.HTTP_200_OK)
    except Exception as e:
        traceback.print_exc()  # ✅ Print complete exception info to terminal
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
