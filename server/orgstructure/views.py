from django.shortcuts import render

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from account.models import User

from .models import (
    Department,
    AssetCategory,
    EmployeeProfile
)

from .serializers import (
    DepartmentSerializer,
    AssetCategorySerializer,
    EmployeeSerializer
)

from .permissions import IsAdminRole

class DepartmentViewSet(viewsets.ModelViewSet):

    queryset = Department.objects.all()

    serializer_class = DepartmentSerializer

    authentication_classes = [JWTAuthentication]

    permission_classes = [
        IsAuthenticated,
        IsAdminRole,
    ]

class AssetCategoryViewSet(viewsets.ModelViewSet):

    queryset = AssetCategory.objects.all()

    serializer_class = AssetCategorySerializer

    authentication_classes = [JWTAuthentication]

    permission_classes = [
        IsAuthenticated,
        IsAdminRole,
    ]

class EmployeeViewSet(viewsets.ModelViewSet):

    queryset = User.objects.select_related(
        "employee_profile"
    ).all()

    serializer_class = EmployeeSerializer

    authentication_classes = [JWTAuthentication]

    permission_classes = [
        IsAuthenticated,
        IsAdminRole,
    ]