from rest_framework.permissions import BasePermission


class IsAdminOrAssetManager(BasePermission):

    def has_permission(self, request, view):
        return request.user.role in [
            "ADMIN",
            "ASSET_MANAGER"
        ]