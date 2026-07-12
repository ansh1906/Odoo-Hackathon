from django.utils import timezone

from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import MaintenanceRequest
from .serializers import MaintenanceSerializer

from asset_manager.models import Asset

class MaintenanceViewSet(viewsets.ModelViewSet):

    queryset = MaintenanceRequest.objects.select_related(
        "asset",
        "raised_by",
        "technician"
    )

    serializer_class = MaintenanceSerializer

    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(
            raised_by=self.request.user
        )


    #Approve

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):

        if request.user.role != "Asset Manager":
            return Response(status=403)

        req = self.get_object()

        req.status = "Approved"
        req.approved_at = timezone.now()

        req.asset.status = "Under Maintenance"

        req.asset.save()

        req.save()

        return Response(
            MaintenanceSerializer(req).data
        )

    #Reject
    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):

        if request.user.role != "Asset Manager":
            return Response(status=403)

        req = self.get_object()

        req.status = "Rejected"

        req.manager_notes = request.data.get(
            "manager_notes", ""
        )

        req.save()

        return Response(
            MaintenanceSerializer(req).data
        )
    
    # Assign Technician

    @action(detail=True, methods=["post"])
    def assign(self, request, pk=None):

        if request.user.role != "Asset Manager":
            return Response(status=403)

        req = self.get_object()

        technician = request.data.get("technician")

        req.technician_id = technician

        req.status = "Technician Assigned"

        req.save()

        return Response(
            MaintenanceSerializer(req).data
        )
    
    # Start Work

    @action(detail=True, methods=["post"])
    def start(self, request, pk=None):

        req = self.get_object()

        req.status = "In Progress"

        req.save()

        return Response(
            MaintenanceSerializer(req).data
        )
    
    # Resolve
    @action(detail=True, methods=["post"])
    def resolve(self, request, pk=None):

        req = self.get_object()

        req.status = "Resolved"

        req.resolved_at = timezone.now()

        req.asset.status = "Available"

        req.asset.save()

        req.save()

        return Response(
            MaintenanceSerializer(req).data
        )