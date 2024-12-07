from django import forms


class LoginForm(forms.Form):
    email = forms.EmailField(label='Email')
    password = forms.CharField(label='Password', widget=forms.PasswordInput)
    code = forms.CharField(label='2FA Code', required=False)


class ProcessMagicLinkForm(forms.Form):
    token = forms.CharField(label='Token', required=True)
    code = forms.CharField(label='2FA Code', required=False)
