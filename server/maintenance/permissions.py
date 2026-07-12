from rest_framework.permissions import BasePermission


class IsAssetManager(BasePermission):

    def has_permission(self, request, view):
        return request.user.role == "Asset Manager"


class IsEmployee(BasePermission):

    def has_permission(self, request, view):
        return request.user.is_authenticated