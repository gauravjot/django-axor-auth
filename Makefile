# Only to be used in development environment

apps := users users_sessions users_totp logs users_forgot_password users_app_tokens uses_magic_link

.PHONY: build publish venv resetdb superuser getready run docs su

build:
	rm -rf dist
	.venv/bin/python -m build

publish:
	.venv/bin/python -m twine upload dist/*

venv:
	rm -rf .venv
	python3 -m venv .venv
	.venv/bin/python -m pip install -r requirements.txt

resetdb:
	rm -rf ./db
	find . -type d -name migrations -prune -not -path "./.venv/*" -exec rm -rf {} \;
	.venv/bin/python manage.py makemigrations $(apps)
	.venv/bin/python manage.py migrate

superuser:
	.venv/bin/python manage.py createsuperuser

getready: venv resetdb

run:
	.venv/bin/python manage.py runserver 0.0.0.0:8001

docs:
	npm update --prefix docs && npm run dev --prefix docs

su:
	.venv/bin/python manage.py createsuperuser