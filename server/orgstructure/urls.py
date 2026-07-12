from rest_framework.routers import DefaultRouter

from .views import (
    DepartmentViewSet,
    AssetCategoryViewSet,
    EmployeeViewSet,
)

router = DefaultRouter()

router.register(
    "departments",
    DepartmentViewSet,
    basename="departments"
)

router.register(
    "asset-categories",
    AssetCategoryViewSet,
    basename="asset-categories"
)

router.register(
    "employees",
    EmployeeViewSet,
    basename="employees"
)

urlpatterns = router.urls