from rest_framework import serializers

from .models import (
    AuditCycle,
    AuditAsset,
    AuditDiscrepancy,
)

class AuditCycleSerializer(serializers.ModelSerializer):

    class Meta:
        model = AuditCycle
        fields = "__all__"

class AuditAssetSerializer(serializers.ModelSerializer):

    asset_name = serializers.CharField(
        source="asset.name",
        read_only=True
    )

    class Meta:
        model = AuditAsset
        fields = "__all__"

class VerifyAssetSerializer(serializers.ModelSerializer):

    class Meta:
        model = AuditAsset
        fields = [
            "status",
            "remarks"
        ]

class AuditDiscrepancySerializer(serializers.ModelSerializer):

    class Meta:
        model = AuditDiscrepancy
        fields = "__all__"