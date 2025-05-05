FROM python:3.10-slim

# Install system dependencies for OpenCV and DeepFace
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .

RUN pip install --no-cache-dir -r requirements.txt

ENV PORT=8080
EXPOSE 8080
CMD ["python", "app.py"]
