from rest_framework.permissions import BasePermission


class IsAssetManager(BasePermission):

    def has_permission(self, request, view):

        return (
            request.user.is_authenticated
            and request.user.role.lower() == "asset_manager"
        )