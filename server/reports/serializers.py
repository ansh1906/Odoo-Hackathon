from rest_framework import serializers


class AssetUtilizationSerializer(serializers.Serializer):
    asset_id = serializers.IntegerField()
    asset_name = serializers.CharField()
    asset_tag = serializers.CharField()

    total_allocations = serializers.IntegerField()
    utilization_days = serializers.IntegerField()

class MaintenanceFrequencySerializer(serializers.Serializer):
    category = serializers.CharField()
    maintenance_count = serializers.IntegerField()

class DueAssetSerializer(serializers.Serializer):
    asset_id = serializers.IntegerField()
    asset_name = serializers.CharField()
    due_date = serializers.DateField()
    status = serializers.CharField()

class DepartmentAllocationSerializer(serializers.Serializer):
    department = serializers.CharField()
    allocated_assets = serializers.IntegerField()

class BookingHeatmapSerializer(serializers.Serializer):
    hour = serializers.IntegerField()
    bookings = serializers.IntegerField()

class DashboardSerializer(serializers.Serializer):

    total_assets = serializers.IntegerField()

    allocated_assets = serializers.IntegerField()

    available_assets = serializers.IntegerField()

    maintenance_assets = serializers.IntegerField()

    active_bookings = serializers.IntegerField()

    overdue_returns = serializers.IntegerField()