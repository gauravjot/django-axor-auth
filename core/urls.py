from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('django_axor_auth.web_auth.urls')),
    path('api/user/', include('django_axor_auth.users.urls')),
]
