FROM python:3.10

ARG GITHUB_USER
ARG GITHUB_TOKEN

WORKDIR /app

RUN echo $GITHUB_USER

RUN git config --global credential.helper store

RUN pip install --upgrade pip

RUN pip install --upgrade git+https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/arubenruben/arquivo-pt-25-abril-package@develop#egg=arquivo_pt[demo]

COPY . .

EXPOSE 8000

ENTRYPOINT ["uvicorn", "main:app", "--host=0.0.0.0", "--port=8000", "--workers", "4"]