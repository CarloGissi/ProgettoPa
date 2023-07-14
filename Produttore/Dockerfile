FROM python:3.9-slim-buster

COPY . /produttore

WORKDIR /produttore

RUN pip install --upgrade pip && pip install -r requirement.txt

ENTRYPOINT [ "python" ]

CMD ["produttore.py"]

