from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Asset
from .serializers import AssetSerializer
from .permissions import IsAssetManager

class AssetCreateAPIView(generics.CreateAPIView):

    serializer_class = AssetSerializer

    permission_classes = [
        IsAuthenticated,
        IsAssetManager,
    ]

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter

class AssetListAPIView(generics.ListAPIView):

    serializer_class = AssetSerializer

    queryset = Asset.objects.all()

    permission_classes = [
        IsAuthenticated,
        IsAssetManager,
    ]

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
    ]

    filterset_fields = [
        "category",
        "status",
        "department",
        "location",
        "is_bookable",
    ]

    search_fields = [
        "asset_tag",
        "serial_number",
        "qr_code",
        "name",
    ]

class AssetDetailAPIView(generics.RetrieveAPIView):

    queryset = Asset.objects.all()

    serializer_class = AssetSerializer

    permission_classes = [
        IsAuthenticated,
        IsAssetManager,
    ]

class AssetUpdateAPIView(generics.UpdateAPIView):

    queryset = Asset.objects.all()

    serializer_class = AssetSerializer

    permission_classes = [
        IsAuthenticated,
        IsAssetManager,
    ]

class AssetDeleteAPIView(generics.DestroyAPIView):

    queryset = Asset.objects.all()

    serializer_class = AssetSerializer

    permission_classes = [
        IsAuthenticated,
        IsAssetManager,
    ]