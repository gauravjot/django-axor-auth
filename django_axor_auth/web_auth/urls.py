from django.urls import path

from . import views

urlpatterns = [
    path('', views.login_page, name='login'),
    path('forgot-password/', views.forgot_password, name='forgot_password'),
    path('logout/', views.forgot_password, name='logout'),
]
