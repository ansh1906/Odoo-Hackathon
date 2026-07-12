from django.db import models
from account.models import User 


class Department(models.Model):
    STATUS_CHOICES = (
        ("active", "Active"),
        ("inactive", "Inactive"),
    )

    name = models.CharField(max_length=150, unique=True)
    description = models.TextField(blank=True)

    # Optional hierarchy
    parent_department = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="sub_departments"
    )

    # Assigned by Admin
    department_head = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="headed_departments",
        limit_choices_to={"role": "department_head"},
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="active"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class AssetCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    # Optional category specific field
    warranty_period_months = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Applicable only for categories like Electronics."
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Asset Categories"
        ordering = ["name"]

    def __str__(self):
        return self.name


class EmployeeProfile(models.Model):
    """
    Extends User for organization-specific information.
    Authentication data remains in User.
    """

    STATUS_CHOICES = (
        ("active", "Active"),
        ("inactive", "Inactive"),
    )

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="employee_profile"
    )

    department = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="employees"
    )

    employee_id = models.CharField(
        max_length=30,
        unique=True
    )

    designation = models.CharField(
        max_length=100,
        blank=True
    )

    phone = models.CharField(
        max_length=20,
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="active"
    )

    joined_on = models.DateField(
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["user__first_name"]

    def __str__(self):
        return f"{self.user.get_full_name()} ({self.employee_id})"