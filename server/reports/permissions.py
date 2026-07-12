from rest_framework import permissions


class IsManager(permissions.BasePermission):
    """
    Allows access only to Admins, Asset Managers,
    and Department Heads.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in [
                "ADMIN",
                "ASSET_MANAGER",
                "DEPARTMENT_HEAD",
            ]
        )