from rest_framework import serializers
from .models import MaintenanceRequest


class MaintenanceSerializer(serializers.ModelSerializer):

    raised_by_name = serializers.CharField(
        source="raised_by.username",
        read_only=True
    )

    technician_name = serializers.CharField(
        source="technician.username",
        read_only=True
    )

    asset_name = serializers.CharField(
        source="asset.name",
        read_only=True
    )

    class Meta:
        model = MaintenanceRequest
        fields = "__all__"
        read_only_fields = (
            "raised_by",
            "created_at",
            "approved_at",
            "resolved_at",
        )