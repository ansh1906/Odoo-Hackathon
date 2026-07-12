from rest_framework.routers import DefaultRouter
from .views import ResourceBookingViewSet

router = DefaultRouter()

router.register(
    "bookings",
    ResourceBookingViewSet,
    basename="bookings"
)

urlpatterns = router.urls