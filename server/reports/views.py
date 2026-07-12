from datetime import date, timedelta
import csv

from django.db.models import Count
from django.db.models.functions import ExtractHour
from django.http import HttpResponse
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.authentication import JWTAuthentication

from .serializers import (
    DashboardSerializer,
    AssetUtilizationSerializer,
    MaintenanceFrequencySerializer,
    DueAssetSerializer,
    DepartmentAllocationSerializer,
    BookingHeatmapSerializer,
)

# Existing apps
from asset_manager.models import Asset
from allocationandtransfer.models import Allocation
from booking.models import ResourceBooking
from maintenance.models import MaintenanceRequest
from orgstructure.models import Department

class DashboardAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        data = {

            "total_assets": Asset.objects.count(),

            "allocated_assets":
                Asset.objects.filter(status="ALLOCATED").count(),

            "available_assets":
                Asset.objects.filter(status="AVAILABLE").count(),

            "maintenance_assets":
                Asset.objects.filter(
                    status="UNDER_MAINTENANCE"
                ).count(),

            "active_bookings":
                Booking.objects.filter(
                    status="ONGOING"
                ).count(),

            "overdue_returns":
                Allocation.objects.filter(
                    expected_return_date__lt=timezone.now(),
                    returned=False
                ).count()

        }

        serializer = DashboardSerializer(data)

        return Response(serializer.data)
    
class AssetUtilizationAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        assets = Asset.objects.annotate(
            total_allocations=Count("allocation")
        )

        response = []

        for asset in assets:

            response.append({

                "asset_id": asset.id,

                "asset_name": asset.name,

                "asset_tag": asset.asset_tag,

                "total_allocations": asset.total_allocations,

                "utilization_days": asset.total_allocations * 30
            })

        serializer = AssetUtilizationSerializer(
            response,
            many=True
        )

        return Response(serializer.data)
    
class MaintenanceFrequencyAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        queryset = MaintenanceRequest.objects.values(

            "asset__category__name"

        ).annotate(

            maintenance_count=Count("id")

        )

        data = []

        for row in queryset:

            data.append({

                "category":
                    row["asset__category__name"],

                "maintenance_count":
                    row["maintenance_count"]

            })

        serializer = MaintenanceFrequencySerializer(
            data,
            many=True
        )

        return Response(serializer.data)
    
class DueAssetsAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        assets = Asset.objects.filter(

            next_maintenance_date__lte=date.today()+timedelta(days=30)

        )

        data = []

        for asset in assets:

            data.append({

                "asset_id":asset.id,

                "asset_name":asset.name,

                "due_date":asset.next_maintenance_date,

                "status":"Maintenance Due"

            })

        serializer = DueAssetSerializer(
            data,
            many=True
        )

        return Response(serializer.data)
    
class DepartmentAllocationAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        departments = Department.objects.annotate(

            allocated_assets=Count(
                "allocation"
            )

        )

        data = []

        for dept in departments:

            data.append({

                "department":dept.name,

                "allocated_assets":
                dept.allocated_assets

            })

        serializer = DepartmentAllocationSerializer(
            data,
            many=True
        )

        return Response(serializer.data)
    
class BookingHeatmapAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        bookings = Booking.objects.annotate(

            hour=ExtractHour("start_time")

        ).values(

            "hour"

        ).annotate(

            bookings=Count("id")

        ).order_by("hour")

        serializer = BookingHeatmapSerializer(
            bookings,
            many=True
        )

        return Response(serializer.data)
    
class ExportUtilizationAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        response = HttpResponse(
            content_type='text/csv'
        )

        response['Content-Disposition'] = (
            'attachment; filename="utilization.csv"'
        )

        writer = csv.writer(response)

        writer.writerow([
            "Asset",
            "Tag",
            "Allocations"
        ])

        assets = Asset.objects.annotate(
            total=Count("allocation")
        )

        for asset in assets:

            writer.writerow([
                asset.name,
                asset.asset_tag,
                asset.total
            ])

        return response