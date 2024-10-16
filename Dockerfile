# pull official base image
FROM python:3.11.10-slim-bookworm

# install packages
RUN apt-get update && apt install -y python3-dev supervisor gcc curl build-essential
RUN pip install uwsgi

# set work directory
RUN mkdir -p /home/app
WORKDIR /home/app
RUN rm -rf ./db

# set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# copy files
COPY . /home/app
RUN rm -rf /home/app/.git

# get project ready
RUN make pipinstallsystem
RUN make resetdb

# Supervisor and uWSGI setup
WORKDIR /var/log/supervisor
RUN cp /home/app/deploy/supervisor.conf /etc/supervisor/conf.d
EXPOSE 8000
RUN service supervisor stop
CMD /usr/bin/supervisord -n -c /etc/supervisor/conf.d/supervisor.conf