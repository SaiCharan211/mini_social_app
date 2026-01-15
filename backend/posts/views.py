from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import Post, Like
from .serializers import PostSerializer ,LikeListSerializer
from .permissions import IsOwnerOrAdmin
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Count
from rest_framework.generics import ListAPIView
from .pagination import LikePagination

class PostViewSet(ModelViewSet):
    queryset=Post.objects.all().order_by("-created_at")
    serializer_class=PostSerializer
    permission_classes=[IsAuthenticated,IsOwnerOrAdmin]

    def get_queryset(self):
        return (
            Post.objects 
            .annotate(likes_count=Count("like"))
            .select_related("author")
            .order_by("-created_at")
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)



class LikeToggleView(APIView):
    permission_classes=[IsAuthenticated]

    def post(self,request,post_id):
        try:
            post=Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({"detail":"Post not found."},status=status.HTTP_404_NOT_FOUND)  
        
        like,created=Like.objects.get_or_create(
            user=request.user,
            post=post
        )

        if not created:
            like.delete()
            return Response({"message":"Unliked"},status=200)
        return Response({"message":"Liked"},status=201)
    


class PostLikesListView(ListAPIView):
    serializer_class=LikeListSerializer

    def get_queryset(self):
        post_id=self.kwargs["post_id"]
        return Like.objects.filter(post_id=post_id).select_related("user")


class PostLikesListView(ListAPIView):
    serializer_class=LikeListSerializer
    pagination_class=LikePagination

    def get_queryset(self):
        post_id=self.kwargs["post_id"]
        return Like.objects.filter(post_id=post_id).select_related("user").order_by("-created_at")