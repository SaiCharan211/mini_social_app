from rest_framework import serializers
from .models import Post,Like
from accounts.serializers import PublicUserSerializer

class PostSerializer(serializers.ModelSerializer):
    author = PublicUserSerializer(read_only=True)
    likes_count = serializers.IntegerField(read_only=True)
    user_has_liked = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model=Post
        fields=["id","author", "content","created_at","likes_count","user_has_liked"]
        read_only_fields=["author"]
    
    def get_user_has_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.like_set.filter(user=request.user).exists()
        return False
    

    def get_likes_count(self,obj):
        return obj.like_set.count()
    

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model=Like
        fields=["id","user","post"]
        read_only_fields=["user"] 


class LikeListSerializer(serializers.ModelSerializer):
    user=PublicUserSerializer()
    
    class Meta:
        model=Like
        fields=["user", "created_at"]