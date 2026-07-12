from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Notification, ActivityLog
from .serializers import (
    NotificationSerializer,
    ActivityLogSerializer,
)


class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(
            recipient=self.request.user
        )


class UnreadNotificationView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(
            recipient=self.request.user,
            is_read=False
        )


class MarkNotificationRead(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):

        try:
            notification = Notification.objects.get(
                pk=pk,
                recipient=request.user
            )

        except Notification.DoesNotExist:
            return Response(
                {"detail": "Notification not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        notification.is_read = True
        notification.save()

        return Response(
            {"message": "Notification marked as read"}
        )


class MarkAllRead(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request):

        Notification.objects.filter(
            recipient=request.user,
            is_read=False
        ).update(is_read=True)

        return Response(
            {"message": "All notifications marked as read"}
        )


class ActivityLogListView(generics.ListAPIView):

    serializer_class = ActivityLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        user = self.request.user

        if user.role == "Admin":
            return ActivityLog.objects.all()

        if user.role in ["Asset Manager", "Department Head"]:
            return ActivityLog.objects.all()

        return ActivityLog.objects.filter(user=user)