FROM python:3.9-slim-buster

COPY . /consumatore

WORKDIR /consumatore

RUN apt-get update && apt-get install -y libgl1-mesa-glx && apt-get install -y libglib2.0-0

RUN pip install --upgrade pip && pip install -r requirements.txt

CMD celery -A consumatore worker --loglevel=info
