import json

from django.shortcuts import render
from django.utils.encoding import force_str

from django_axor_auth.configurator import config
from django_axor_auth.users.users_magic_link.views import consume_magic_link, request_magic_link
from django_axor_auth.users.views import login, me, logout
from .forms import SignInForm, ProcessMagicLinkForm

app_info = dict(
    app_name=config.APP_NAME,
    app_logo=config.APP_LOGO
)


# Sign In Page
# -----------------------------------------------------------------------------
def sign_in_page(request):
    template = 'sign_in.html'
    # Set the request source
    request.requested_by = 'web'
    # Check if there is a sign in request
    if request.method == "POST":
        form = SignInForm(request.POST)
        # Check if it was passwordless sign in
        is_passwordless = request.GET.get('method') == 'passwordless'
        if not is_passwordless and form.is_valid():
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
                # User is signed in
                response = render(request, template,
                                  {'app': app_info, 'success': True, 'redirect': request.GET.get('redirect')})
                response.cookies = api_res.cookies
                return response
        elif is_passwordless:
            # Passwordless sign in
            email = force_str(form.data.get('email'))
            request.data = {'email': email}
            request_magic_link(request)
            return render(request, template, {'app': app_info, 'success': True, 'passwordless': True})
        return render(request, template, {'app': app_info, 'error': 'Please enter email and password.', 'form': form,
                                          'passwordless': is_passwordless})
    else:
        # Check if user is already signed in
        user = me(request)
        if user.status_code < 400:
            return render(request, template,
                          {'app': app_info, 'success': True, 'redirect': request.GET.get('redirect')})
        else:
            # User is not signed in
            form = SignInForm()
            # Check if ?method=passwordless is in the URL
            if request.GET.get('method') == 'passwordless':
                return render(request, template, {'app': app_info, 'passwordless': True, 'form': form})
            # default
            return render(request, template, {'app': app_info, 'form': form})


# Logout
# -----------------------------------------------------------------------------
def sign_out_page(request):
    template = 'sign_out.html'
    redirect_url = request.GET.get('redirect')
    referrer = request.GET.get('referrer')
    if referrer is None or len(referrer) < 1:
        referrer = request.META.get('HTTP_REFERER')
    if request.method == "POST":
        request.requested_by = 'web'
        logout(request)
        return render(request, template, {'app': app_info, 'success': True, 'redirect': redirect_url})
    return render(request, template, {'app': app_info, 'referrer': referrer})


def forgot_password(request):
    return render(request, 'sign_in.html')


def process_forgot_password(request):
    return render(request, 'sign_in.html')


# Magic Link or Passwordless Login
# This is the URL that is sent to the user's email
# -----------------------------------------------------------------------------
def process_magic_link(request):
    template = 'process_magic_link.html'
    # Set the request source
    request.requested_by = 'web'
    # Sanitize the token
    token = request.GET.get('token')
    # Check if user is already signed in
    if request.method == "GET":
        user = me(request)
        if user.status_code < 400:
            return render(request, template, {'app': app_info, 'success': True})
    if token:
        form = ProcessMagicLinkForm(initial={'token': token})
        if request.method == "POST":
            api_res = consume_magic_link(request)
            if api_res.status_code >= 400:
                error = json.loads(api_res.content).get('title')
                error_code = json.loads(api_res.content).get('code')
                # Check if the error is due to TOTP requirement
                if api_res.status_code == 401 and 'TOTP' in error_code:
                    return render(request, template, {'app': app_info, 'totp': True, 'form': form})
                # Give user the error message
                return render(request, template, {'app': app_info, 'error': error, 'form': None})
            else:
                # User is signed in
                response = render(request, template, {'app': app_info, 'success': True})
                response.cookies = api_res.cookies
                return response
        return render(request, template, {'app': app_info, 'form': form, 'load': True})
    else:
        return render(request, template, {'app': app_info, 'error': 'Token is required.'})


def process_verify_email(request):
    return render(request, 'sign_in.html')
