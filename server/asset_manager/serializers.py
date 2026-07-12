from rest_framework import serializers
from .models import (
    Asset,
    AssetAllocationHistory,
    AssetMaintenanceHistory
)

class AllocationHistorySerializer(serializers.ModelSerializer):

    allocated_to = serializers.StringRelatedField()

    class Meta:
        model = AssetAllocationHistory
        fields = "__all__"
    
class MaintenanceHistorySerializer(serializers.ModelSerializer):

    class Meta:
        model = AssetMaintenanceHistory
        fields = "__all__"

class AssetSerializer(serializers.ModelSerializer):

    category_name = serializers.CharField(source="category.name", read_only=True, allow_null=True)
    department_name = serializers.CharField(source="department.name", read_only=True)

    allocation_history = AllocationHistorySerializer(
        many=True,
        read_only=True
    )

    maintenance_history = MaintenanceHistorySerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Asset

        fields = "__all__"

        read_only_fields = (
            "asset_tag",
            "qr_code",
            "category_name",
            "department_name",
        )
