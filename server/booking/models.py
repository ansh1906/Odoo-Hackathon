from django.db import models
from django.conf import settings
from asset_manager.models import Asset
from django.utils import timezone


class ResourceBooking(models.Model):

    STATUS_CHOICES = [
        ("UPCOMING", "Upcoming"),
        ("ONGOING", "Ongoing"),
        ("COMPLETED", "Completed"),
        ("CANCELLED", "Cancelled"),
    ]

    resource = models.ForeignKey(
        Asset,
        on_delete=models.CASCADE,
        related_name="bookings"
    )

    booked_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="resource_bookings"
    )

    title = models.CharField(max_length=150)

    purpose = models.TextField(blank=True)

    start_time = models.DateTimeField()

    end_time = models.DateTimeField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="UPCOMING"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["start_time"]

    def __str__(self):
        return f"{self.resource.name} - {self.title}"

    def update_status(self):

        now = timezone.now()

        if self.status == "CANCELLED":
            return

        if now < self.start_time:
            self.status = "UPCOMING"

        elif self.start_time <= now <= self.end_time:
            self.status = "ONGOING"

        else:
            self.status = "COMPLETED"