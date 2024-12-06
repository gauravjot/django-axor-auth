from django.urls import path

from . import views

urlpatterns = [
    path('', views.login_page, name='login'),
    path('forgot-password/', views.forgot_password, name='forgot_password'),
    path('logout/', views.forgot_password, name='logout'),
    path('process/verify-email/', views.process_verify_email, name='process_verify_email'),
    path('process/forgot-password/', views.process_forgot_password, name='process_forgot_password'),
    path('process/magic-link/', views.process_magic_link, name='process_magic_link'),
]
