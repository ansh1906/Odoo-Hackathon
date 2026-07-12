from django.urls import path

from .views import (
    AllocateAssetView,
    ReturnAssetView,
    CreateTransferRequestView,
    ApproveTransferView,
    RejectTransferView,
    AllocationListView,
    AssetHistoryView,
)

urlpatterns = [
    path(
        "allocate/",
        AllocateAssetView.as_view(),
        name="allocate-asset",
    ),
    path(
        "return/<int:pk>/",
        ReturnAssetView.as_view(),
        name="return-asset",
    ),
    path(
        "transfer-request/",
        CreateTransferRequestView.as_view(),
        name="transfer-request",
    ),
    path(
        "transfer/<int:pk>/approve/",
        ApproveTransferView.as_view(),
        name="approve-transfer",
    ),
    path(
        "transfer/<int:pk>/reject/",
        RejectTransferView.as_view(),
        name="reject-transfer",
    ),
    path(
        "",
        AllocationListView.as_view(),
        name="allocation-list",
    ),
    path(
        "history/<int:asset_id>/",
        AssetHistoryView.as_view(),
        name="asset-history",
    ),
]