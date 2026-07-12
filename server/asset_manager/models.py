from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class AssetStatus(models.TextChoices):
    AVAILABLE = "Available", "Available"
    ALLOCATED = "Allocated", "Allocated"
    RESERVED = "Reserved", "Reserved"
    MAINTENANCE = "Under Maintenance", "Under Maintenance"
    LOST = "Lost", "Lost"
    RETIRED = "Retired", "Retired"
    DISPOSED = "Disposed", "Disposed"


class AssetCondition(models.TextChoices):
    NEW = "New", "New"
    GOOD = "Good", "Good"
    FAIR = "Fair", "Fair"
    DAMAGED = "Damaged", "Damaged"


class Asset(models.Model):

    asset_tag = models.CharField(
        max_length=20,
        unique=True,
        editable=False
    )

    name = models.CharField(max_length=255)

    category = models.ForeignKey(
        "orgstructure.AssetCategory",   # change if different
        on_delete=models.PROTECT,
        null=True,
        blank=True,
    )

    serial_number = models.CharField(
        max_length=255,
        unique=True
    )

    acquisition_date = models.DateField()

    acquisition_cost = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    condition = models.CharField(
        max_length=20,
        choices=AssetCondition.choices,
        default=AssetCondition.NEW
    )

    status = models.CharField(
        max_length=30,
        choices=AssetStatus.choices,
        default=AssetStatus.AVAILABLE
    )

    location = models.CharField(max_length=255)

    department = models.ForeignKey(
        "orgstructure.Department",
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    is_bookable = models.BooleanField(default=False)

    qr_code = models.CharField(
        max_length=255,
        blank=True,
        unique=True
    )

    photo = models.ImageField(
        upload_to="assets/photos/",
        null=True,
        blank=True
    )

    document = models.FileField(
        upload_to="assets/docs/",
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):

        if not self.asset_tag:

            last = Asset.objects.order_by("-id").first()

            if last:
                number = int(last.asset_tag.split("-")[1]) + 1
            else:
                number = 1

            self.asset_tag = f"AF-{number:04d}"

        if not self.qr_code:
            self.qr_code = self.asset_tag

        super().save(*args, **kwargs)

    def __str__(self):
        return self.asset_tag
    
class AssetAllocationHistory(models.Model):

    asset = models.ForeignKey(
        Asset,
        on_delete=models.CASCADE,
        related_name="allocation_history"
    )

    allocated_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True
    )

    allocated_at = models.DateTimeField(auto_now_add=True)

    returned_at = models.DateTimeField(
        null=True,
        blank=True
    )

    notes = models.TextField(blank=True)

    def __str__(self):
        return self.asset.asset_tag
    
class AssetMaintenanceHistory(models.Model):

    asset = models.ForeignKey(
        Asset,
        on_delete=models.CASCADE,
        related_name="maintenance_history"
    )

    issue = models.TextField()

    resolved = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    resolved_at = models.DateTimeField(
        null=True,
        blank=True
    )

    def __str__(self):
        return self.asset.asset_tag
