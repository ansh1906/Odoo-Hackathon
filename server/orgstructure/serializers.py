from rest_framework import serializers

from .models import (
    Department,
    AssetCategory,
    EmployeeProfile
)

from account.models import User

class DepartmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Department
        fields = "__all__"

class AssetCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = AssetCategory
        fields = "__all__"

class EmployeeSerializer(serializers.ModelSerializer):

    department = serializers.PrimaryKeyRelatedField(
        source="employee_profile.department",
        queryset=Department.objects.all(),
        allow_null=True
    )

    status = serializers.CharField(
        source="employee_profile.status"
    )

    employee_id = serializers.CharField(
        source="employee_profile.employee_id"
    )

    designation = serializers.CharField(
        source="employee_profile.designation",
        required=False,
        allow_blank=True
    )

    phone = serializers.CharField(
        source="employee_profile.phone",
        required=False,
        allow_blank=True
    )

    class Meta:
        model = User
        fields = (
            "id",
            "first_name",
            "last_name",
            "email",
            "role",
            "department",
            "employee_id",
            "designation",
            "phone",
            "status",
        )

    def update(self, instance, validated_data):

        profile_data = validated_data.pop("employee_profile", {})

        for key, value in validated_data.items():
            setattr(instance, key, value)

        instance.save()

        profile = instance.employee_profile

        for key, value in profile_data.items():
            setattr(profile, key, value)

        profile.save()

        return instance