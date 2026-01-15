from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import User
from .serializers import PublicUserSerializer, CustomTokenObtainPairSerializer, ResetPasswordEmailRequestSerializer, SetNewPasswordSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_bytes
from django.utils.http import urlsafe_base64_encode
from .utils import Util

class RegisterView(APIView):
    def post(self,request):
        email=request.data.get("email")
        password=request.data.get("password")

        if User.objects.filter(email=email).exists():
            return Response({"error":"Email exists"},status=400)
        
        user=User.objects.create_user(email=email,password=password)
        return Response({"message":"User Created"},status=201)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = PublicUserSerializer(request.user)
        return Response(serializer.data)

class RequestPasswordResetEmail(generics.GenericAPIView):
    serializer_class = ResetPasswordEmailRequestSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        email = request.data.get('email', '')

        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
            
            # Ensure this matches your frontend URL
            current_site = 'localhost:5173'
            absurl = f'http://{current_site}/reset-password/{uidb64}/{token}'
            
            email_body = f'Hello, \n Use the link below to reset your password: \n{absurl}'
            data = {'email_body': email_body, 'to_email': user.email, 'email_subject': 'Reset your password'}
            
            try:
                Util.send_email(data)
            except Exception as e:
                return Response({'error': f'Failed to send email: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        return Response({'success': 'We have sent you a link to reset your password'}, status=status.HTTP_200_OK)

class SetNewPasswordAPIView(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer

    def patch(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'success': True, 'message': 'Password reset success'}, status=status.HTTP_200_OK)
