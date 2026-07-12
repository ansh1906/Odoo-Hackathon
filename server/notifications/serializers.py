from rest_framework import serializers
from .models import Notification, ActivityLog


class NotificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Notification
        fields = "__all__"
        read_only_fields = (
            "recipient",
            "created_at",
        )


class ActivityLogSerializer(serializers.ModelSerializer):

    user_email = serializers.CharField(source="user.email", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)
    role = serializers.CharField(source="user.role", read_only=True)

    class Meta:
        model = ActivityLog
        fields = "__all__"