FROM python:3.9

COPY ./backend/requirements.txt /app/backend/requirements.txt
WORKDIR /app/
RUN python -m pip install --no-cache-dir --upgrade -r backend/requirements.txt

COPY backend /app/backend

COPY ./data /app/data

CMD ["uvicorn", "cir.interface.http:app", "--proxy-headers", "--host", "0.0.0.0", "--port", "8000"]
