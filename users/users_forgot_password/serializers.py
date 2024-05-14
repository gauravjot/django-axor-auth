from django.utils.encoding import force_str as _
from rest_framework import serializers
from .models import ForgotPassword
from .utils import hash_this


class HealthyForgotPasswordSerializer(serializers.Serializer):
    key = serializers.CharField()

    def validate(self, data):
        err = 'Link or instance is no longer valid. Please request a new one.'
        # Check if key is provided
        if 'key' not in data:
            raise serializers.ValidationError(
                'Key/token is not present.')
        try:
            fp = ForgotPassword.objects.get(key=hash_this(_(data['key'])))
            # Check if key is correct
            if not fp.check_key(_(data['key'])):
                raise serializers.ValidationError(err)
            # Check if fp is valid
            if not fp.check_valid():
                raise serializers.ValidationError(err)
        except ForgotPassword.DoesNotExist:
            raise serializers.ValidationError(err)
        return fp
