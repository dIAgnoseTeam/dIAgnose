FROM python:3.12-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1 \
	PYTHONUNBUFFERED=1 \
	PIP_NO_CACHE_DIR=1

WORKDIR /app

# Instalar dependencias del sistema mínimas (y limpiar lista de paquetes)
RUN apt-get update && apt-get install -y --no-install-recommends \
	ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

# Instalar dependencias Python
COPY requirements.txt .
RUN python -m pip install --upgrade pip \
	&& pip install --no-cache-dir -r requirements.txt

# Copiar código fuente (estructura completa del proyecto)
COPY . .

# Crear directorio para la base de datos
RUN mkdir -p /app/db

EXPOSE 5000

# La inicialización de la DB se ejecuta automáticamente en run.py
CMD ["python", "run.py"]