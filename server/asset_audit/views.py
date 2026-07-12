from django.utils import timezone

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from asset_manager.models import Asset

from .models import (
    AuditCycle,
    AuditAsset,
    AuditDiscrepancy,
    AuditHistory,
)

from .serializers import (
    AuditCycleSerializer,
    AuditAssetSerializer,
    VerifyAssetSerializer,
    AuditDiscrepancySerializer,
)

from .permissions import IsAdminOrAssetManager

class AuditCycleListCreateView(generics.ListCreateAPIView):
    queryset = AuditCycle.objects.all().order_by("-created_at")
    serializer_class = AuditCycleSerializer

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):

        audit = serializer.save(created_by=self.request.user)

        assets = Asset.objects.all()

        if audit.department:
            assets = assets.filter(department=audit.department)

        if audit.location:
            assets = assets.filter(location=audit.location)

        AuditAsset.objects.bulk_create([
            AuditAsset(
                audit_cycle=audit,
                asset=asset
            )
            for asset in assets
        ])

        AuditHistory.objects.create(
            audit_cycle=audit,
            action="Audit Cycle Created",
            performed_by=self.request.user
        )

class AuditCycleDetailView(generics.RetrieveAPIView):
    queryset = AuditCycle.objects.all()
    serializer_class = AuditCycleSerializer

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class AssignAuditorsView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdminOrAssetManager]

    def post(self, request, pk):

        audit = AuditCycle.objects.get(pk=pk)

        auditor_ids = request.data.get("auditors", [])

        audit.auditors.set(auditor_ids)

        AuditHistory.objects.create(
            audit_cycle=audit,
            action="Auditors Assigned",
            performed_by=request.user
        )

        return Response(
            {"message": "Auditors assigned successfully."},
            status=status.HTTP_200_OK
        )
    
class AuditAssetsView(generics.ListAPIView):

    serializer_class = AuditAssetSerializer

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AuditAsset.objects.filter(
            audit_cycle_id=self.kwargs["pk"]
        )
    
class VerifyAssetView(generics.UpdateAPIView):

    queryset = AuditAsset.objects.all()
    serializer_class = VerifyAssetSerializer

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):

        audit_asset = serializer.save(
            verified_by=self.request.user,
            verified_at=timezone.now()
        )

        if audit_asset.status in ["MISSING", "DAMAGED"]:

            AuditDiscrepancy.objects.get_or_create(
                audit_asset=audit_asset,
                defaults={
                    "issue": audit_asset.status,
                    "remarks": audit_asset.remarks
                }
            )

        AuditHistory.objects.create(
            audit_cycle=audit_asset.audit_cycle,
            action=f"{audit_asset.asset.name} marked as {audit_asset.status}",
            performed_by=self.request.user
        )

class DiscrepancyListView(generics.ListAPIView):

    serializer_class = AuditDiscrepancySerializer

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return AuditDiscrepancy.objects.filter(
            audit_asset__audit_cycle_id=self.kwargs["pk"]
        )
    

class AuditHistoryView(generics.ListAPIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        history = AuditHistory.objects.filter(
            audit_cycle_id=pk
        ).values(
            "action",
            "performed_by__username",
            "timestamp"
        )

        return Response(history)
    

class CloseAuditView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdminOrAssetManager]

    def post(self, request, pk):

        audit = AuditCycle.objects.get(pk=pk)

        audit_assets = AuditAsset.objects.filter(
            audit_cycle=audit
        )

        for item in audit_assets:

            if item.status == "MISSING":

                asset = item.asset
                asset.status = "LOST"
                asset.save()

        audit.status = "CLOSED"
        audit.save()

        AuditHistory.objects.create(
            audit_cycle=audit,
            action="Audit Closed",
            performed_by=request.user
        )

        return Response({
            "message": "Audit closed successfully."
        })