from django.shortcuts import render
from .forms import LoginForm
from django_axor_auth.users.views import login, me
import json
from django_axor_auth.configurator import config


def login_page(request):
    template = 'login.html'
    app_logo = config.APP_LOGO
    app_name = config.APP_NAME
    app_info = dict(
        app_name=app_name,
        app_logo=app_logo
    )
    # Set the request source
    request.requested_by = 'web'
    # Check if there is a login request
    if request.method == "POST":
        form = LoginForm(request.POST)
        if form.is_valid():
            request.data = form.cleaned_data
            api_res = login(request)
            if api_res.status_code >= 400:
                error = json.loads(api_res.content).get('title')
                error_code = json.loads(api_res.content).get('code')
                # Check if the error is due to TOTP requirement
                if api_res.status_code == 401 and 'TOTP' in error_code:
                    return render(request, template, {'app': app_info, 'totp': True, 'form': form})
                # Give user the error message
                return render(request, template, {'app': app_info, 'error': error, 'form': form})
            else:
                # User is logged in
                response = render(request, template, {'app': app_info, 'success': True})
                response.cookies = api_res.cookies
                return response
    else:
        # Check if user is already logged in
        user = me(request)
        if user.status_code < 400:
            print('User is already logged in')
            return render(request, template, {'app': app_info, 'success': True})
        else:
            # User is not logged in
            form = LoginForm()
            return render(request, template, {'app': app_info, 'form': form})


def forgot_password(request):
    return render(request, 'login.html')


def logout(request):
    return render(request, 'login.html')


def process_forgot_password(request):
    return render(request, 'login.html')


def process_magic_link(request):
    return render(request, 'login.html')


def process_verify_email(request):
    return render(request, 'login.html')
