from django.urls import path

from . import views

urlpatterns = [
    path('', views.login_page, name='login'),
    path('forgot-password/', views.forgot_password, name='forgot_password'),
    path('logout/', views.logout_page, name='logout'),
    path('verify-email/process/', views.process_verify_email, name='process_verify_email'),
    path('forgot-password/process/', views.process_forgot_password, name='process_forgot_password'),
    path('magic-link/process/', views.process_magic_link, name='process_magic_link'),
]
