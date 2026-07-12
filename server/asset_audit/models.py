from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class AuditCycle(models.Model):

    STATUS_CHOICES = (
        ("OPEN", "Open"),
        ("IN_PROGRESS", "In Progress"),
        ("CLOSED", "Closed"),
    )

    name = models.CharField(max_length=150)

    department = models.ForeignKey(
        "orgstructure.Department",
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    location = models.CharField(max_length=255, blank=True)

    start_date = models.DateField()
    end_date = models.DateField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="OPEN"
    )

    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="created_audits"
    )

    auditors = models.ManyToManyField(
        User,
        related_name="assigned_audits",
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
class AuditAsset(models.Model):

    STATUS = (
        ("PENDING", "Pending"),
        ("VERIFIED", "Verified"),
        ("MISSING", "Missing"),
        ("DAMAGED", "Damaged"),
    )

    audit_cycle = models.ForeignKey(
        AuditCycle,
        on_delete=models.CASCADE,
        related_name="audit_assets"
    )

    asset = models.ForeignKey(
        "asset_manager.Asset",
        on_delete=models.CASCADE
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS,
        default="PENDING"
    )

    remarks = models.TextField(blank=True)

    verified_by = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL
    )

    verified_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("audit_cycle", "asset")

class AuditDiscrepancy(models.Model):

    audit_asset = models.OneToOneField(
        AuditAsset,
        on_delete=models.CASCADE
    )

    issue = models.CharField(max_length=100)

    remarks = models.TextField(blank=True)

    resolved = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

class AuditHistory(models.Model):

    audit_cycle = models.ForeignKey(
        AuditCycle,
        on_delete=models.CASCADE
    )

    action = models.CharField(max_length=255)

    performed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True
    )

    timestamp = models.DateTimeField(auto_now_add=True)