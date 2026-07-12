from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

router = routers.DefaultRouter()

urlpatterns = router.urls

urlpatterns += [
    path('admin/', admin.site.urls),
    path('account/', include('account.urls')), 
    path('asset/manage', include('asset_manager.urls')),
    path('orgstructure/', include('orgstructure.urls')),
    path('allocateandtransfer/', include('allocationandtransfer.urls')),
    path('booking/', include('booking.urls')),
    path('maintenance/', include('maintenance.urls')),
    path('audit/', include('asset_audit.urls')),
    path('report/', include('reports.urls')),
    path('notifications/', include('notifications.urls')),

]