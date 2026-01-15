from django.urls import path
from .views import RegisterView, CurrentUserView, CustomTokenObtainPairView, RequestPasswordResetEmail, SetNewPasswordAPIView

urlpatterns=[
    path("register/",RegisterView.as_view()),
    path("login/",CustomTokenObtainPairView.as_view()),
    path("profile/", CurrentUserView.as_view()),
    path('request-reset-email/', RequestPasswordResetEmail.as_view(), name="request-reset-email"),
    path('password-reset-complete/', SetNewPasswordAPIView.as_view(), name="password-reset-complete"),
]