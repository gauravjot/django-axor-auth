from django.contrib import admin
from django.http import HttpRequest
from .models import ApiCallLog

# Register your models here.


class ApiCallLogAdmin(admin.ModelAdmin):
    list_display = ('user_email', 'url', 'status', 'created_at')
    search_fields = ['session__user__email', 'url']
    search_help_text = 'Search with URL and user email'
    list_per_page = 100
    ordering = ('-created_at',)
    save_on_top = False
    save_as = False
    readonly_fields = ['url', 'response', 'session', 'status', 'created_at']

    def user_email(self, obj):
        return obj.session.user.email if obj.session else '---'

    def has_delete_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request):
        return False


admin.site.register(ApiCallLog, ApiCallLogAdmin)
