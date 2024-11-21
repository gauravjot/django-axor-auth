from django.utils.encoding import force_str
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_axor_auth.utils.error_handling.error_message import ErrorMessage
from django_axor_auth.middlewares import is_web
from django_axor_auth.configurator import config
# JWT
import jwt
# Session Imports
from .users_sessions.api import create_session, delete_session, get_last_session_details
from .users_sessions.utils import get_active_session
# App Token Imports
from .users_app_tokens.api import create_app_token, get_last_token_session_details, delete_app_token
from .users_app_tokens.utils import get_active_token
# TOTP Imports
from .users_totp.api import has_totp, authenticate_totp
# User Imports
from .serializers import UserSerializer, LoginSerializer, RegistrationSerializer
from .permissions import IsAuthenticated


@api_view(['POST'])
def register(request):
    # Validate request data and create user
    serializer = RegistrationSerializer(data=request.data)
    if serializer.is_valid():
        try:
            # login user
            return login(request._request)
        except Exception as e:
            # Return error message
            err_msg = ErrorMessage(
                detail=str(e),
                status=400,
                instance=request.build_absolute_uri(),
                title='Invalid information provided.',
                code='InvalidRegistrationInfo'
            )
            return err_msg.to_response()
    # Return error message
    errors = serializer.errors
    err_msg = ErrorMessage(
        detail=errors,
        status=400,
        instance=request.build_absolute_uri(),
        title='Invalid information provided.',
        code='InvalidRegistrationInfo'
    )
    return err_msg.to_response()


@api_view(['POST'])
def login(request):
    # Validate request data
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        # Get user
        user = serializer.validated_data
        # Check if user hash TOTP enabled
        totp_row = has_totp(user)
        if totp_row is not None:
            # If totp code is not provided
            if 'code' not in request.data or ('code' in request.data and (request.data['code'] == None or request.data['code'] == '')):
                return ErrorMessage(
                    detail="TOTP code is required.",
                    status=401,
                    instance=request.build_absolute_uri(),
                    title='2FA code is required',
                    code='TOTPRequired'
                ).to_response()
            # Authenticate TOTP
            if not authenticate_totp(user, force_str(request.data['code']), totp_row):
                return ErrorMessage(
                    detail="Provided TOTP code or backup code is incorrect. Please try again.",
                    status=401,
                    instance=request.build_absolute_uri(),
                    title='2FA code is incorrect',
                    code='TOTPIncorrect'
                ).to_response()
        # Get last session details
        last_session = get_last_session_details(user)  # already serialized
        last_token_session = get_last_token_session_details(
            user)  # already serialized
        # Respond depending on the client
        if is_web(request):
            # Session based authentication
            key, session = create_session(user, request)
            # Add HTTPOnly cookie
            response = Response(data={
                "last_session": last_session,
                "last_token_session": last_token_session,
                "user": UserSerializer(user).data
            },
                status=200
            )
            response.set_cookie(
                key=config.AUTH_COOKIE_NAME,
                value=jwt.encode(
                    {
                        "session_key": key
                    },
                    settings.SECRET_KEY,
                    algorithm='HS256'
                ),
                expires=session.expire_at,
                httponly=True,
                secure=config.AUTH_COOKIE_SECURE,
                samesite=config.AUTH_COOKIE_SAMESITE,
                domain=config.AUTH_COOKIE_DOMAIN
            )
            return response
        else:
            # Token based authentication
            token, app_token = create_app_token(user, request)
            # Respond with token and user data
            return Response(data={
                "last_session": last_session,
                "last_token_session": last_token_session,
                "user": UserSerializer(user).data,
                "session": dict(
                    id=app_token.id,
                    key=jwt.encode(
                        {
                            "app_token": token
                        },
                        settings.SECRET_KEY,
                        algorithm='HS256'
                    ),
                )
            },
                status=200
            )
    errors = serializer.errors
    err_msg = ErrorMessage(
        detail=errors,
        status=400,
        instance=request.build_absolute_uri(),
        title='Invalid credentials',
        code='LoginSerializerErrors'
    )
    return err_msg.to_response()


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    # Delete session or token
    if is_web(request):
        delete_session(get_active_session(request).user,
                       get_active_session(request).id)
        response = Response(status=200)
        response.delete_cookie(
            key=config.AUTH_COOKIE_NAME,
            domain=config.AUTH_COOKIE_DOMAIN
        )
        return response
    else:
        delete_app_token(get_active_token(request).user,
                         get_active_token(request).id)
    # Return response
    return Response(status=200)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    # Session-based authentication
    if is_web(request):
        session = get_active_session(request)
        if session is not None:
            return Response(data=dict(
                user=UserSerializer(session.user).data
            ), status=200)
    # Token-based authentication
    app_token = get_active_token(request)
    if app_token is not None:
        return Response(data=UserSerializer(app_token.user).data, status=200)
    # No valid active session or token found
    return ErrorMessage(
        detail='No active session or token found.',
        status=400,
        instance=request.build_absolute_uri(),
        title='Invalid request',
        code='NoActiveSessionOrToken'
    ).to_response()
