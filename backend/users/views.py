from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

@api_view(['POST'])
def register(request):
    data=request.data
    username=data.get('username')
    email=data.get('email')
    password=data.get('password')
    # validation
    if not username or not email or not password:
        return Response(
            {"error": "All fields are required"},
            status=status.HTTP_400_BAD_REQUEST
        )
    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "Username already taken"},
            status=status.HTTP_400_BAD_REQUEST
        )
    if User.objects.filter(email=email).exists():
        return Response(
            {"error": "Email already registered"},
            status=status.HTTP_400_BAD_REQUEST
        )
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )
    return Response(
        {
            "message": "User registered successfully",
            "user_id": user.id,
            "username": user.username,
            "email": user.email
        },
        status=status.HTTP_201_CREATED
    )
@api_view(['POST'])
def login(request):
    data=request.data
    username=data.get('username')
    password=data.get('password')
    if not username or not password:
        return Response(
            {"error": "Username and password are required"},
            status=status.HTTP_400_BAD_REQUEST
        )
    user = authenticate(username=username, password=password)
    if user is None:
        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )
    refresh = RefreshToken.for_user(user)
    return Response(
        {
            "message": "Login successful",
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        },
        status=status.HTTP_200_OK
    )
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    user = request.user
    return Response(
        {
            "user_id": user.id,
            "username": user.username,
            "email": user.email
        },
        status=status.HTTP_200_OK
    )