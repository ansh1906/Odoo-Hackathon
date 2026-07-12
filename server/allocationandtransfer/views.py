from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from asset_manager.models import Asset
from orgstructure.models import Department
from account.models import User

from .models import Allocation, TransferRequest
from .permissions import (
    IsAssetManager,
    IsAssetManagerOrDepartmentHead
)
from .serializers import (
    AllocationSerializer,
    TransferRequestSerializer
)

class AllocateAssetView(APIView):

    permission_classes = [IsAuthenticated, IsAssetManager]

    @transaction.atomic
    def post(self, request):

        serializer = AllocationSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        asset = serializer.validated_data["asset"]

        if asset.status != "AVAILABLE":
            active = Allocation.objects.filter(
                asset=asset,
                status="ACTIVE"
            ).first()

            return Response(
                {
                    "message": f"Asset already allocated to {active.employee.username}",
                    "transfer_available": True,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        allocation = serializer.save(
            allocated_by=request.user,
            status="ACTIVE"
        )

        asset.status = "ALLOCATED"
        asset.save()

        return Response(
            AllocationSerializer(allocation).data,
            status=status.HTTP_201_CREATED
        )
    
class ReturnAssetView(APIView):

    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request, pk):

        allocation = get_object_or_404(
            Allocation,
            pk=pk,
            status="ACTIVE"
        )

        allocation.status = "RETURNED"
        allocation.return_notes = request.data.get(
            "return_notes",
            ""
        )
        allocation.returned_at = timezone.now()
        allocation.save()

        asset = allocation.asset
        asset.status = "AVAILABLE"
        asset.save()

        return Response(
            {"message": "Asset returned successfully"}
        )
    
class CreateTransferRequestView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = TransferRequestSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        asset = serializer.validated_data["asset"]

        allocation = get_object_or_404(
            Allocation,
            asset=asset,
            status="ACTIVE"
        )

        transfer = serializer.save(
            requested_by=request.user,
            from_employee=allocation.employee,
            status="REQUESTED"
        )

        return Response(
            TransferRequestSerializer(transfer).data,
            status=status.HTTP_201_CREATED
        )
    
class ApproveTransferView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAssetManagerOrDepartmentHead
    ]

    @transaction.atomic
    def post(self, request, pk):

        transfer = get_object_or_404(
            TransferRequest,
            pk=pk,
            status="REQUESTED"
        )

        old = Allocation.objects.get(
            asset=transfer.asset,
            status="ACTIVE"
        )

        old.status = "TRANSFERRED"
        old.save()

        Allocation.objects.create(
            asset=transfer.asset,
            employee=transfer.to_employee,
            department=transfer.to_employee.department,
            allocated_by=request.user,
            expected_return_date=old.expected_return_date,
            status="ACTIVE",
        )

        transfer.status = "APPROVED"
        transfer.approved_by = request.user
        transfer.save()

        return Response(
            {"message": "Transfer Approved"}
        )
    
class RejectTransferView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAssetManagerOrDepartmentHead
    ]

    def post(self, request, pk):

        transfer = get_object_or_404(
            TransferRequest,
            pk=pk,
            status="REQUESTED"
        )

        transfer.status = "REJECTED"
        transfer.approved_by = request.user
        transfer.save()

        return Response(
            {"message": "Transfer Rejected"}
        )
    
class AllocationListView(ListAPIView):

    permission_classes = [IsAuthenticated]

    serializer_class = AllocationSerializer

    def get_queryset(self):

        queryset = Allocation.objects.all()

        employee = self.request.GET.get("employee")
        status_filter = self.request.GET.get("status")

        if employee:
            queryset = queryset.filter(employee=employee)

        if status_filter:
            queryset = queryset.filter(status=status_filter)

        if self.request.GET.get("overdue") == "true":

            queryset = queryset.filter(
                expected_return_date__lt=timezone.now().date(),
                status="ACTIVE"
            )

        return queryset
    
class AssetHistoryView(ListAPIView):

    permission_classes = [IsAuthenticated]

    serializer_class = AllocationSerializer

    def get_queryset(self):

        asset_id = self.kwargs["asset_id"]

        return Allocation.objects.filter(
            asset_id=asset_id
        ).order_by("-allocated_at")