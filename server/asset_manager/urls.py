from django.urls import path
from .views import (
    AssetCreateAPIView,
    AssetListAPIView,
    AssetDetailAPIView,
    AssetUpdateAPIView,
    AssetDeleteAPIView,
)

urlpatterns = [

    path(
        "",
        AssetListAPIView.as_view(),
        name="asset-list",
    ),

    path(
        "create/",
        AssetCreateAPIView.as_view(),
        name="asset-create",
    ),

    path(
        "<int:pk>/",
        AssetDetailAPIView.as_view(),
        name="asset-detail",
    ),

    path(
        "<int:pk>/update/",
        AssetUpdateAPIView.as_view(),
        name="asset-update",
    ),

    path(
        "<int:pk>/delete/",
        AssetDeleteAPIView.as_view(),
        name="asset-delete",
    ),
]