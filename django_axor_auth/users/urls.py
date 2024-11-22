from django.urls import path, include
from . import views


"""
api/user/
"""
urlpatterns = [
    # Basic
    path('register/', views.register),
    path('login/', views.login),
    path('logout/', views.logout),
    path('delete/', views.deleteUser),

    # Get user info
    path('me/', views.me),

    # Verify user
    path('verify_email/resend/', views.resendVerificationEmail),
    path('verify_email/<emailtoken>/', views.verifyEmail),

    # Change stuff
    path('change_password/', views.changePassword),
    path('change_name/', views.changeName),
    path('change_email/', views.changeEmail),

    # Session management
    path('active_sessions/', views.getUserSessions),
    path('active_session/close/', views.closeSession),

    # Addon modules
    path('totp/', include('django_axor_auth.users.users_totp.urls')),
    path('forgot_password/',
         include('django_axor_auth.users.users_forgot_password.urls')),
]
