from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

router = routers.DefaultRouter()

urlpatterns = router.urls

urlpatterns += [
    path('admin/', admin.site.urls),
    path('account/', include('account.urls')), 
    # path('assets/', include('assets.urls')),
    path('orgstructure/', include('orgstructure.urls')),

]