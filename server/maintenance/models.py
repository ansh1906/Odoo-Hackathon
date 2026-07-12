from django.db import models
from django.conf import settings


class MaintenanceRequest(models.Model):

    PRIORITY_CHOICES = (
        ("Low", "Low"),
        ("Medium", "Medium"),
        ("High", "High"),
        ("Critical", "Critical"),
    )

    STATUS_CHOICES = (
        ("Pending", "Pending"),
        ("Approved", "Approved"),
        ("Rejected", "Rejected"),
        ("Technician Assigned", "Technician Assigned"),
        ("In Progress", "In Progress"),
        ("Resolved", "Resolved"),
    )

    asset = models.ForeignKey(
        "asset_manager.Asset",
        on_delete=models.CASCADE,
        related_name="maintenance_requests"
    )

    raised_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="maintenance_raised"
    )

    technician = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="maintenance_assigned"
    )

    description = models.TextField()

    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default="Medium"
    )

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default="Pending"
    )

    photo = models.ImageField(
        upload_to="maintenance/",
        null=True,
        blank=True
    )

    manager_notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    approved_at = models.DateTimeField(null=True, blank=True)

    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.asset} - {self.status}"