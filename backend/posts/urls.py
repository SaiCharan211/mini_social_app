from django.urls import path,include
from .views import PostViewSet,LikeToggleView, PostLikesListView
from rest_framework.routers import DefaultRouter

router=DefaultRouter()

router.register("posts", PostViewSet,basename='posts')


urlpatterns=[
    path('',include(router.urls)),
    path('posts/<int:post_id>/like/', LikeToggleView.as_view(), name='like-toggle'),
    path('posts/<int:post_id>/likes/',PostLikesListView.as_view()),
]