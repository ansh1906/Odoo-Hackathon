from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from .models import ResourceBooking
from .serializers import ResourceBookingSerializer


class ResourceBookingViewSet(viewsets.ModelViewSet):

    serializer_class = ResourceBookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        user = self.request.user

        queryset = ResourceBooking.objects.select_related(
            "resource",
            "booked_by"
        )

        for booking in queryset:
            booking.update_status()
            booking.save(update_fields=["status"])

        if user.role == "ADMIN":
            return queryset

        return queryset.filter(booked_by=user)

    def perform_create(self, serializer):
        serializer.save(booked_by=self.request.user)

class ResourceBookingViewSet(viewsets.ModelViewSet):

    ...

    @action(detail=True, methods=["post"])

    def cancel(self, request, pk=None):

        booking = self.get_object()

        booking.status = "CANCELLED"

        booking.save()

        return Response({

            "message": "Booking cancelled."

        })
    
'''
Calendar API
Frontend needs:
GET
/api/bookings/?resource=3

Modify queryset:

resource = self.request.query_params.get("resource")

if resource:
    queryset = queryset.filter(resource_id=resource)
'''