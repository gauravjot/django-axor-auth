from django import forms


class RegisterForm(forms.Form):
    first_name = forms.CharField(label='First Name', required=True)
    last_name = forms.CharField(label='Last Name', required=True)
    email = forms.EmailField(label='Email', required=True)
    password = forms.CharField(label='Password', widget=forms.PasswordInput, required=True)
    confirm_password = forms.CharField(label='Confirm Password', widget=forms.PasswordInput, required=True)


class SignInForm(forms.Form):
    email = forms.EmailField(label='Email', required=True)
    password = forms.CharField(label='Password', widget=forms.PasswordInput, required=True)
    code = forms.CharField(label='2FA Code', required=False)


class ProcessMagicLinkForm(forms.Form):
    token = forms.CharField(label='Token', required=True)
    code = forms.CharField(label='2FA Code', required=False)


class ForgotPasswordForm(forms.Form):
    email = forms.EmailField(label='Email', required=True)


class ProcessForgotPasswordForm(forms.Form):
    token = forms.CharField(label='Token', required=True)
    password = forms.CharField(label='Password', widget=forms.PasswordInput, required=True)
    confirm_password = forms.CharField(label='Confirm Password', widget=forms.PasswordInput, required=True)

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        confirm_password = cleaned_data.get('confirm_password')
        if password != confirm_password:
            raise forms.ValidationError('Passwords do not match')
        return cleaned_data


class TotpForm(forms.Form):
    code = forms.CharField(label='2FA Code', required=True)
