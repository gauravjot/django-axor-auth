from django.urls import path, include
from . import views


"""
api/user/
"""
urlpatterns = [
    path('register/', views.register),
    path('login/', views.login),
    path('logout/', views.logout),
    path('me/', views.me),
    path('totp/', include('django_axor_auth.users.users_totp.urls')),
    path('forgot_password/',
         include('django_axor_auth.users.users_forgot_password.urls')),
]
