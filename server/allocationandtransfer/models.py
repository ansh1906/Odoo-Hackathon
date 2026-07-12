from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class Allocation(models.Model):

    STATUS_CHOICES = [
        ("ACTIVE", "Active"),
        ("RETURNED", "Returned"),
        ("TRANSFERRED", "Transferred"),
        ("OVERDUE", "Overdue"),
    ]

    asset = models.ForeignKey(
        "asset_manager.Asset",
        on_delete=models.CASCADE,
        related_name="allocations"
    )

    employee = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="asset_allocations"
    )

    department = models.ForeignKey(
        "orgstructure.Department",
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    allocated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name="allocated_assets"
    )

    allocated_at = models.DateTimeField(auto_now_add=True)

    expected_return_date = models.DateField(
        null=True,
        blank=True
    )

    returned_at = models.DateTimeField(
        null=True,
        blank=True
    )

    return_notes = models.TextField(blank=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="ACTIVE"
    )

    class Meta:
        ordering = ["-allocated_at"]

    def __str__(self):
        return f"{self.asset} -> {self.employee}"
    

class TransferRequest(models.Model):

    STATUS = [
        ("REQUESTED", "Requested"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
    ]

    asset = models.ForeignKey(
        "asset_manager.Asset",
        on_delete=models.CASCADE
    )

    from_employee = models.ForeignKey(
        User,
        related_name="transfer_from",
        on_delete=models.CASCADE
    )

    to_employee = models.ForeignKey(
        User,
        related_name="transfer_to",
        on_delete=models.CASCADE
    )

    requested_by = models.ForeignKey(
        User,
        related_name="transfer_requested",
        on_delete=models.CASCADE
    )

    approved_by = models.ForeignKey(
        User,
        related_name="transfer_approved",
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    reason = models.TextField()

    status = models.CharField(
        max_length=20,
        choices=STATUS,
        default="REQUESTED"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)