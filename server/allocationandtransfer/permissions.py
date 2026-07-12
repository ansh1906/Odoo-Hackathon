from rest_framework.permissions import BasePermission

class IsAssetManager(BasePermission):

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "ASSET_MANAGER"
        )


class IsDepartmentHead(BasePermission):

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "DEPARTMENT_HEAD"
        )


class IsAssetManagerOrDepartmentHead(BasePermission):

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in [
                "ASSET_MANAGER",
                "DEPARTMENT_HEAD",
            ]
        )