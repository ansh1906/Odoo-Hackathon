from django.db import models
from django.conf import settings


class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ("ASSET_ASSIGNED", "Asset Assigned"),
        ("MAINTENANCE_APPROVED", "Maintenance Approved"),
        ("MAINTENANCE_REJECTED", "Maintenance Rejected"),
        ("BOOKING_CONFIRMED", "Booking Confirmed"),
        ("BOOKING_CANCELLED", "Booking Cancelled"),
        ("BOOKING_REMINDER", "Booking Reminder"),
        ("TRANSFER_APPROVED", "Transfer Approved"),
        ("OVERDUE_RETURN", "Overdue Return"),
        ("AUDIT_DISCREPANCY", "Audit Discrepancy"),
        ("GENERAL", "General"),
    ]

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications"
    )

    title = models.CharField(max_length=255)

    message = models.TextField()

    notification_type = models.CharField(
        max_length=50,
        choices=NOTIFICATION_TYPES,
        default="GENERAL"
    )

    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.recipient.email} - {self.title}"


class ActivityLog(models.Model):

    ACTION_TYPES = [
        ("CREATE", "Create"),
        ("UPDATE", "Update"),
        ("DELETE", "Delete"),
        ("ALLOCATE", "Allocate Asset"),
        ("RETURN", "Return Asset"),
        ("TRANSFER", "Transfer Asset"),
        ("BOOK", "Book Resource"),
        ("MAINTENANCE", "Maintenance"),
        ("AUDIT", "Audit"),
        ("LOGIN", "Login"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    action = models.CharField(max_length=50, choices=ACTION_TYPES)

    module = models.CharField(max_length=100)

    description = models.TextField()

    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]

    def __str__(self):
        return f"{self.user} - {self.action}"