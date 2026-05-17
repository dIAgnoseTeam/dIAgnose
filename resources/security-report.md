# Informe de Seguridad — dIAgnose

**Fecha:** 2026-05-17  
**Rama analizada:** `feature`  
**Alcance:** Backend (Flask/Python) + Frontend (React/Vite)  
**Autor del análisis:** Revisión automatizada completa del proyecto

---

## Índice

1. [Resumen ejecutivo](#1-resumen-ejecutivo)
2. [Hallazgos críticos](#2-hallazgos-críticos)
3. [Protección de rutas — Control de acceso por rol](#3-protección-de-rutas--control-de-acceso-por-rol)
4. [Vulnerabilidades de seguridad](#4-vulnerabilidades-de-seguridad)
5. [Refactors recomendados](#5-refactors-recomendados)
6. [Aspectos positivos existentes](#6-aspectos-positivos-existentes)
7. [Tabla de prioridades](#7-tabla-de-prioridades)

---

## 1. Resumen ejecutivo

El proyecto dIAgnose implementa una aplicación web con autenticación OAuth 2.0 (Google), JWT para sesiones y un sistema RBAC básico (admin / usuario). La arquitectura está bien separada (rutas → servicios → repositorios → modelos), pero presenta varios problemas de seguridad, desde secretos expuestos en el repositorio hasta ausencia de validación de entrada y cabeceras HTTP de seguridad. Este documento detalla cada problema con su solución concreta.

---

## 4. Vulnerabilidades de seguridad

### 🟠 ALTO — Token JWT almacenado en localStorage

**Archivo:** `frontend/src/services/api.jsx`, `frontend/src/contexts/AuthContext.jsx`  
**Problema:** `localStorage.getItem("token")` es accesible desde cualquier JavaScript en la página. Un ataque XSS puede robar el token y suplantar al usuario.

**Solución:** Migrar a HttpOnly cookies:

```python
# Backend: enviar token como HttpOnly cookie en lugar de JSON body
from flask import make_response

@auth_bp.route("/google/callback")
def google_callback():
    # ... generar token ...
    response = make_response(redirect(f"{FRONTEND_URL}/auth/callback"))
    response.set_cookie(
        "access_token",
        value=token,
        httponly=True,       # No accesible desde JS
        secure=True,         # Solo HTTPS
        samesite="Lax",      # Protección CSRF básica
        max_age=7 * 24 * 3600
    )
    return response
```

```javascript
// Frontend: eliminar manejo manual del token
// axios enviará la cookie automáticamente con withCredentials: true
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,  // Envía cookies automáticamente
});
// Eliminar: api.interceptors.request (ya no necesario para token)
```

---

### 🟠 ALTO — Sin validación de entrada (Input Validation)

**Archivos afectados:** Todos los archivos en `backend/app/routes/`  
**Problema:** Los datos de los formularios se leen directamente de `request.json` sin validación de tipos, rangos ni campos requeridos. Un ejemplo concreto:

```python
# Patrón actual en review_routes.py
data = request.json
puntuacion = data.get("puntuacion")           # Podría ser string, None, -999...
precision_diagnostica = data.get("precision_diagnostica")  # Sin validación 1-5
```

**Solución:** Usar `marshmallow` o `pydantic` para schemas de validación:

```python
# backend/app/schemas/review_schema.py
from marshmallow import Schema, fields, validate, ValidationError

class CreateReviewSchema(Schema):
    id_caso = fields.Int(required=True)
    puntuacion = fields.Int(required=True, validate=validate.Range(min=1, max=5))
    precision_diagnostica = fields.Int(required=True, validate=validate.Range(min=1, max=5))
    claridad_textual = fields.Int(required=True, validate=validate.Range(min=1, max=5))
    relevancia_clinica = fields.Int(required=True, validate=validate.Range(min=1, max=5))
    adecuacion_contextual = fields.Int(required=True, validate=validate.Range(min=1, max=5))
    nivel_tecnico = fields.Int(required=True, validate=validate.Range(min=1, max=5))
```

```python
# En la ruta:
schema = CreateReviewSchema()
try:
    data = schema.load(request.json)
except ValidationError as err:
    return jsonify({"error": "Datos inválidos", "details": err.messages}), 422
```

---

### 🟠 ALTO — Sin rate limiting

**Problema:** Los endpoints de autenticación y creación de recursos no tienen límite de peticiones por IP/usuario.

**Solución:** Instalar `Flask-Limiter`:

```bash
pip install Flask-Limiter
```

```python
# backend/app/__init__.py
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)

def create_app():
    app = Flask(__name__)
    limiter.init_app(app)
    # ...
```

```python
# En rutas de autenticación:
@auth_bp.route("/google/login")
@limiter.limit("10 per minute")
def google_login():
    # ...

# En creación de reviews:
@reviews_bp.route("/create", methods=["POST"])
@token_required
@limiter.limit("30 per hour")
def create_review(current_user):
    # ...
```

---

### 🟡 MEDIO — Sin cabeceras de seguridad HTTP

**Problema:** El backend no envía cabeceras de seguridad estándar. Sin `Content-Security-Policy`, el navegador permite cargar recursos de cualquier origen, facilitando XSS y clickjacking.

**Solución:** Instalar `Flask-Talisman`:

```bash
pip install flask-talisman
```

```python
# backend/app/__init__.py
from flask_talisman import Talisman

def create_app():
    app = Flask(__name__)
    
    Talisman(
        app,
        force_https=False,  # True en producción
        strict_transport_security=True,
        content_security_policy={
            "default-src": "'self'",
            "img-src": ["'self'", "data:", "https://lh3.googleusercontent.com"],
            "script-src": "'self'",
            "style-src": ["'self'", "'unsafe-inline'"],  # Tailwind requiere esto
        },
        x_content_type_options=True,
        x_frame_options="DENY",
        referrer_policy="strict-origin-when-cross-origin",
    )
```

---

### 🟡 MEDIO — Sin protección CSRF

**Problema:** Endpoints que modifican estado (POST, PUT, PATCH, DELETE) no validan tokens CSRF. Si JWT migra a cookies HttpOnly, esto se vuelve especialmente crítico.

**Solución:** Implementar CSRF tokens con `Flask-WTF`:

```bash
pip install Flask-WTF
```

```python
# backend/app/__init__.py
from flask_wtf.csrf import CSRFProtect

csrf = CSRFProtect()

def create_app():
    app = Flask(__name__)
    csrf.init_app(app)
    # Excluir rutas de API que usan JWT (no cookies)
    # Si se migra a cookies: no excluir ninguna
```

---

### 🟡 MEDIO — JWT_SECRET_KEY comparte valor con SECRET_KEY

**Archivo:** `backend/app/config.py`  
**Problema:**
```python
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", SECRET_KEY)
```
Si `JWT_SECRET_KEY` no está definido en `.env`, usa el mismo valor que `SECRET_KEY`. Comprometer uno compromete ambos.

**Solución:** Definir ambos como variables independientes en `.env` y hacerlos **obligatorios** (sin fallback):

```python
# backend/app/config.py
class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")  # Sin fallback
    
    @classmethod
    def validate(cls):
        missing = [k for k in ["SECRET_KEY", "JWT_SECRET_KEY"] if not getattr(cls, k)]
        if missing:
            raise RuntimeError(f"Variables de entorno requeridas no definidas: {missing}")
```

---

### 🟡 MEDIO — Debug logging expone datos de chat

**Archivo:** `backend/app/services/chat_service.py` (líneas 61-66)  
**Problema:** `print()` statements imprimen el payload completo de la API con el historial de conversación del usuario.

**Solución:** Reemplazar con logging estructurado en nivel DEBUG:

```python
import logging
logger = logging.getLogger(__name__)

# En lugar de print(payload):
logger.debug("AI API request: model=%s, messages_count=%d", 
             payload.get("model"), len(payload.get("messages", [])))
# No loguear el contenido del mensaje
```

Y en producción, configurar el nivel de log a `INFO` o superior.

---

### 🟡 MEDIO — API de IA externa sin timeout ni límite de respuesta

**Archivo:** `backend/app/services/chat_service.py`  
**Problema:** La llamada a `http://cloud.riberadeltajo.es:11200/generate` no tiene timeout. Si el servidor externo tarda o devuelve una respuesta enorme, puede bloquear el worker de Flask indefinidamente.

**Solución:**

```python
import requests

response = requests.post(
    AI_API_URL,
    json=payload,
    timeout=(5, 30),  # (connect_timeout, read_timeout) en segundos
    stream=False
)
response.raise_for_status()

# Limitar tamaño de respuesta
MAX_RESPONSE_SIZE = 50 * 1024  # 50 KB
content = response.content[:MAX_RESPONSE_SIZE]
```

---

### 🟡 MEDIO — Sin límite de tamaño de petición

**Archivo:** `backend/app/__init__.py`  
**Problema:** Flask acepta peticiones de cualquier tamaño por defecto. Un atacante puede enviar un body enorme para agotar memoria.

**Solución:**

```python
def create_app():
    app = Flask(__name__)
    app.config["MAX_CONTENT_LENGTH"] = 1 * 1024 * 1024  # 1 MB máximo
```

---

### 🟡 MEDIO — ProxyFix con confianza sin validar

**Archivo:** `backend/app/__init__.py`  
**Problema:** `ProxyFix(app, x_for=1, x_proto=1, x_host=1, x_prefix=1)` confía en cabeceras `X-Forwarded-*`. Si el servidor no está detrás de un proxy de confianza, un atacante puede falsificar IP de origen.

**Solución:** Solo activar ProxyFix si el despliegue está realmente detrás de un reverse proxy (nginx/traefik). En desarrollo sin proxy, desactivarlo:

```python
if os.getenv("BEHIND_PROXY", "false").lower() == "true":
    from werkzeug.middleware.proxy_fix import ProxyFix
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)
```

---

### 🟢 BAJO — Sin auditoría de acciones administrativas

**Problema:** No hay registro de quién eliminó un caso, cambió un rol de usuario, o modificó la configuración del sistema.

**Solución:** Implementar un middleware de auditoría ligero:

```python
# backend/app/utils/audit.py
import logging
from datetime import datetime

audit_logger = logging.getLogger("audit")

def log_admin_action(user_id: int, action: str, resource: str, resource_id=None, details=None):
    audit_logger.info(
        "AUDIT user_id=%s action=%s resource=%s resource_id=%s details=%s timestamp=%s",
        user_id, action, resource, resource_id, details, datetime.utcnow().isoformat()
    )
```

```python
# En rutas admin (ejemplo en user_routes.py):
@bp.route("/<int:user_id>/role", methods=["PUT"])
@admin_required
def change_user_role(current_user, user_id):
    # ... lógica ...
    log_admin_action(
        user_id=current_user["user_id"],
        action="CHANGE_ROLE",
        resource="user",
        resource_id=user_id,
        details=f"new_role={new_role}"
    )
```

---

### 🟢 BAJO — Captura genérica de excepciones

**Problema:** `except Exception as e: return jsonify({"error": str(e)}), 500` en muchas rutas expone mensajes internos del servidor y oculta el tipo real del error.

**Solución:** Usar manejadores de error registrados globalmente:

```python
# backend/app/__init__.py
def create_app():
    app = Flask(__name__)
    
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Recurso no encontrado"}), 404
    
    @app.errorhandler(403)
    def forbidden(e):
        return jsonify({"error": "Acceso denegado"}), 403
    
    @app.errorhandler(500)
    def server_error(e):
        app.logger.error("Internal error: %s", e, exc_info=True)
        return jsonify({"error": "Error interno del servidor"}), 500
```

---

### 🟢 BAJO — Endpoints de health sin autenticación

**Rutas:** `GET /health/hello`, `GET /health/health`  
**Problema:** Devuelven información sobre el estado del servidor sin autenticación. Permiten a atacantes confirmar que la API está activa.

**Solución (opción A):** Proteger con token estático para health checks de infraestructura:

```python
HEALTH_TOKEN = os.getenv("HEALTH_CHECK_TOKEN")

@health_bp.route("/health")
def health():
    token = request.headers.get("X-Health-Token")
    if HEALTH_TOKEN and token != HEALTH_TOKEN:
        return jsonify({"error": "Unauthorized"}), 401
    return jsonify({"status": "ok"}), 200
```

**Solución (opción B):** Limitar acceso a localhost únicamente (si no hay load balancer externo):

```python
@health_bp.route("/health")
def health():
    if request.remote_addr not in ("127.0.0.1", "::1"):
        return jsonify({"error": "Not found"}), 404
    return jsonify({"status": "ok"}), 200
```

---

## 5. Refactors recomendados

### RF-01 — Centralizar verificación de rol admin

**Problema:** El patrón `if int(current_user.get("id_rol", 0)) != 1` está duplicado en al menos 8 rutas distintas.

**Solución:** Usar el decorador `@admin_required` descrito en sección 3. Reduce código duplicado y hace auditable de un vistazo qué rutas están protegidas.

---

### RF-02 — Separar JWT_SECRET_KEY de SECRET_KEY

**Archivos:** `backend/app/config.py`, `backend/.env`

El fallback `os.getenv("JWT_SECRET_KEY", SECRET_KEY)` es un antipatrón. Dos secretos distintos deben tener valores distintos y ninguno debe tener fallback sobre el otro.

---

### RF-03 — Repositorios con tipado explícito

**Archivos:** `backend/app/repositories/`

Los repositorios usan dicts anónimos para retornar datos. Usar dataclasses o TypedDict añade autocompletado, detecta errores en tiempo de análisis estático y documenta el contrato de datos:

```python
from dataclasses import dataclass

@dataclass
class UserDTO:
    id: int
    nombre: str
    correo: str
    id_rol: int
    rol_nombre: str
```

---

### RF-04 — Paginación consistente

**Problema:** Algunos endpoints tienen paginación (`page`, `per_page`), otros devuelven todos los registros. `GET /users/` devuelve todos los usuarios sin paginar.

**Solución:** Estandarizar respuesta paginada en todos los endpoints de listado:

```python
# backend/app/utils/pagination.py
def paginate_query(query, page: int, per_page: int):
    total = query.count()
    items = query.offset((page - 1) * per_page).limit(per_page).all()
    return {
        "data": items,
        "pagination": {
            "page": page,
            "per_page": per_page,
            "total": total,
            "pages": (total + per_page - 1) // per_page,
        }
    }
```

---

### RF-05 — Constantes para IDs de roles

**Problema:** El ID de rol admin (`1`) está hardcodeado en múltiples rutas como número mágico.

**Solución:**

```python
# backend/app/utils/roles.py
class RolId:
    ADMIN = 1
    USUARIO = 2
    MODERADOR = 3

# Uso:
if current_user.get("id_rol") == RolId.ADMIN:
    # ...
```

---

### RF-06 — Respuestas de error estandarizadas

**Problema:** Algunos endpoints devuelven `{"error": "..."}`, otros `{"message": "..."}`, otros solo el código HTTP. La inconsistencia dificulta el manejo de errores en el frontend.

**Solución:** Definir un helper de respuesta:

```python
# backend/app/utils/responses.py
from flask import jsonify

def error_response(message: str, status_code: int, details=None):
    body = {"error": message, "status": status_code}
    if details:
        body["details"] = details
    return jsonify(body), status_code

def success_response(data, status_code: int = 200):
    return jsonify({"data": data, "status": status_code}), status_code
```

---

### RF-07 — Variables de entorno validadas al arrancar

**Problema:** Si falta una variable de entorno crítica (como `JWT_SECRET_KEY`), la app arranca con el fallback o falla en tiempo de ejecución de forma críptica.

**Solución:** Validar todas las variables requeridas en `create_app()`:

```python
REQUIRED_ENV_VARS = [
    "SECRET_KEY", "JWT_SECRET_KEY",
    "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET",
    "DATABASE_URL", "FRONTEND_URL",
]

def create_app():
    missing = [v for v in REQUIRED_ENV_VARS if not os.getenv(v)]
    if missing:
        raise RuntimeError(f"Variables de entorno requeridas no definidas: {missing}")
    # ...
```

---

### RF-08 — Frontend: separar lógica de autenticación del contexto

**Archivo:** `frontend/src/contexts/AuthContext.jsx`  
**Problema:** El contexto de autenticación mezcla estado, lógica de API y manejo de localStorage. Dificulta testing y reutilización.

**Solución:** Extraer la lógica de token a un hook `useToken()` y el cliente de API a `services/auth.js`.

---

### RF-09 — Eliminar rol `moderador` o implementarlo

**Archivo:** `backend/seed_roles.py`  
El rol `moderador` (id=3) está seeded en la base de datos pero **no tiene ninguna lógica de permisos implementada**. Es dead code a nivel de negocio. O se implementa con permisos reales (ver RF-RBAC en sección 3) o se elimina del seed para evitar confusión.

---

### RF-10 — Docker: no exponer puertos de base de datos en producción

**Archivo:** `docker-compose.prod.yml`  
Verificar que el puerto de SQLite/base de datos no esté mapeado al host en producción. Solo el frontend (80/443) y el backend (5000 internamente) deben ser accesibles.

---

## 6. Aspectos positivos existentes

Se reconocen las siguientes buenas prácticas ya implementadas:

| Aspecto | Detalle |
|---------|---------|
| **ORM con SQLAlchemy** | Previene SQL injection por defecto mediante consultas parametrizadas |
| **OAuth 2.0 con Authlib** | Implementación estándar de Google OIDC, sin manejo manual de contraseñas |
| **Separación en capas** | Arquitectura rutas → servicios → repositorios → modelos bien definida |
| **JWT con expiración** | Tokens de 7 días con verificación de firma HS256 |
| **CORS configurado** | Whitelist de orígenes con `supports_credentials` |
| **Guards en frontend** | `PrivateRoute` y `AdminRoute` como primera línea de defensa UX |
| **Ownership check en chats** | El endpoint de mensajes verifica que el chat pertenece al usuario |
| **IDs tipados en rutas** | `<int:id>` en rutas de Flask previene inyección de strings en IDs |
| **Feature flags** | `AppSettings.chat_enabled` permite deshabilitar funcionalidades sin deploy |
| **Separación de entornos** | `docker-compose.yml` vs `docker-compose.prod.yml` |

---

## 7. Tabla de prioridades

| Prioridad | ID | Problema | Esfuerzo | Impacto |
|-----------|-----|---------|----------|---------|
| 🔴 P0 | SEC-01 | Rotar secretos expuestos (HF_TOKEN, GOOGLE_CLIENT_SECRET) | Bajo | Crítico |
| 🔴 P0 | SEC-02 | Purgar secretos del historial git | Medio | Crítico |
| 🟠 P1 | SEC-03 | Decorador `@admin_required` centralizado | Bajo | Alto |
| 🟠 P1 | SEC-04 | Validación de entrada con marshmallow | Medio | Alto |
| 🟠 P1 | SEC-05 | Rate limiting en endpoints auth + escritura | Bajo | Alto |
| 🟡 P2 | SEC-06 | Cabeceras de seguridad HTTP (Flask-Talisman) | Bajo | Medio |
| 🟡 P2 | SEC-07 | JWT en HttpOnly cookies (eliminar localStorage) | Alto | Medio |
| 🟡 P2 | SEC-08 | Timeout y límite de respuesta en API de IA | Bajo | Medio |
| 🟡 P2 | SEC-09 | JWT_SECRET_KEY independiente de SECRET_KEY | Bajo | Medio |
| 🟡 P2 | RF-05 | Constantes para IDs de roles (no magic numbers) | Bajo | Bajo |
| 🟡 P2 | RF-07 | Validar variables de entorno al arrancar | Bajo | Medio |
| 🟢 P3 | RF-02 | Repositorios con tipado explícito (dataclasses) | Medio | Bajo |
| 🟢 P3 | RF-04 | Paginación consistente en todos los listados | Medio | Bajo |
| 🟢 P3 | RF-06 | Respuestas de error estandarizadas | Bajo | Bajo |
| 🟢 P3 | SEC-10 | Auditoría de acciones administrativas | Medio | Bajo |
| 🟢 P3 | SEC-11 | Eliminar debug prints en chat_service | Bajo | Bajo |

---

*Generado el 2026-05-17*
