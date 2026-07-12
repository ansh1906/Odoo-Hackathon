from rest_framework import serializers

from .models import Allocation, TransferRequest

class AllocationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Allocation
        fields = "__all__"
        read_only_fields = (
            "allocated_by",
            "allocated_at",
            "returned_at",
            "status",
        )


class TransferRequestSerializer(serializers.ModelSerializer):

    class Meta:
        model = TransferRequest
        fields = "__all__"
        read_only_fields = (
            "requested_by",
            "approved_by",
            "from_employee",
            "status",
        )