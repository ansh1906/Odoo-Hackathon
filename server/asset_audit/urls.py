from django.urls import path
from .views import (
    AuditCycleListCreateView,
    AuditCycleDetailView,
    AssignAuditorsView,
    AuditAssetsView,
    CloseAuditView,
    VerifyAssetView,
)

urlpatterns = [

    # GET all audits / POST create audit
    path(
        "",
        AuditCycleListCreateView.as_view(),
    ),

    # GET single audit
    path(
        "<uuid:pk>/",          # use <str:pk> if your PK isn't UUID
        AuditCycleDetailView.as_view(),
    ),

    # Assign auditors
    path(
        "<uuid:pk>/assign/",
        AssignAuditorsView.as_view(),
    ),

    # Assets in an audit
    path(
        "<uuid:pk>/assets/",
        AuditAssetsView.as_view(),
    ),

    # Close audit
    path(
        "<uuid:pk>/close/",
        CloseAuditView.as_view(),
    ),

    # Verify an audited asset
    path(
        "verify/<uuid:pk>/",
        VerifyAssetView.as_view(),
    ),
]