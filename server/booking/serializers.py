from rest_framework import serializers
from .models import ResourceBooking
from django.utils import timezone


class ResourceBookingSerializer(serializers.ModelSerializer):

    booked_by_name = serializers.CharField(
        source="booked_by.username",
        read_only=True
    )

    resource_name = serializers.CharField(
        source="resource.name",
        read_only=True
    )

    class Meta:
        model = ResourceBooking
        fields = "__all__"

    def validate(self, data):

        start = data["start_time"]
        end = data["end_time"]
        resource = data["resource"]

        if start >= end:
            raise serializers.ValidationError(
                "End time must be after start time."
            )

        overlapping = ResourceBooking.objects.filter(
            resource=resource,
            status__in=["UPCOMING", "ONGOING"],
            start_time__lt=end,
            end_time__gt=start, # overlap check
        )

        if self.instance:
            overlapping = overlapping.exclude(id=self.instance.id)

        if overlapping.exists():
            raise serializers.ValidationError(
                "This resource is already booked for this time slot."
            )

        return data