from django.urls import path

from .views import (
    NotificationListView,
    UnreadNotificationView,
    MarkNotificationRead,
    MarkAllRead,
    ActivityLogListView,
)

urlpatterns = [

    path(
        "notifications/",
        NotificationListView.as_view(),
        name="notifications",
    ),

    path(
        "notifications/unread/",
        UnreadNotificationView.as_view(),
        name="unread-notifications",
    ),

    path(
        "notifications/<int:pk>/read/",
        MarkNotificationRead.as_view(),
        name="mark-read",
    ),

    path(
        "notifications/read-all/",
        MarkAllRead.as_view(),
        name="read-all",
    ),

    path(
        "activity-logs/",
        ActivityLogListView.as_view(),
        name="activity-logs",
    ),
]