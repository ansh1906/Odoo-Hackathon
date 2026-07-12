from django.urls import path

from .views import *

urlpatterns = [

    path(
        "dashboard/",
        DashboardAPIView.as_view()
    ),

    path(
        "asset-utilization/",
        AssetUtilizationAPIView.as_view()
    ),

    path(
        "maintenance-frequency/",
        MaintenanceFrequencyAPIView.as_view()
    ),

    path(
        "due-assets/",
        DueAssetsAPIView.as_view()
    ),

    path(
        "department-allocation/",
        DepartmentAllocationAPIView.as_view()
    ),

    path(
        "booking-heatmap/",
        BookingHeatmapAPIView.as_view()
    ),

    path(
        "export/",
        ExportUtilizationAPIView.as_view()
    ),

]