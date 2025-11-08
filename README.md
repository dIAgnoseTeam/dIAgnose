<div align="center">

# 🏥 dIAgnose

### Sistema de Gestión Hospitalaria

[![Status](https://img.shields.io/badge/Status-In%20Development-yellow?style=for-the-badge)](https://github.com/dIAgnoseTeam/dIAgnose)
[![Version](https://img.shields.io/badge/Version-1.0-blue?style=for-the-badge)](https://github.com/dIAgnoseTeam/dIAgnose)

![React](https://img.shields.io/badge/React-18.2+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-2.0+-000000?style=for-the-badge&logo=flask&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

---

</div>

## 🎯 ¿Qué es dIAgnose?

**dIAgnose** es nuestra solución para modernizar la gestión hospitalaria. Básicamente, es una aplicación web que permite a médicos y personal sanitario gestionar pacientes, consultar historiales y comunicarse en tiempo real, todo desde un mismo lugar.

### ✨ Lo que puedes hacer con dIAgnose

- 👥 **Gestionar pacientes**: crear perfiles, actualizar datos, buscar historiales rápidamente
- 💬 **Chat en tiempo real**: comunicación instantánea entre el equipo médico usando WebSockets
- 🔐 **Acceso seguro**: autenticación con JWT y control de permisos según tu rol
- 📊 **Historial médico**: registro completo de consultas, tratamientos y signos vitales
- 📱 **Responsive**: funciona en ordenadores, tablets y móviles

---

## 🏗️ Arquitectura del Sistema

Hemos diseñado dIAgnose con una arquitectura de **tres capas** clásica pero efectiva: frontend en React, backend en Flask y dos bases de datos especializadas (PostgreSQL para datos estructurados y MongoDB para el chat).

```mermaid
graph TB
    subgraph Client["🖥️ CAPA DE PRESENTACIÓN"]
        UI[React + Tailwind CSS<br/>Puerto 3000]
    end
    
    subgraph API["⚙️ CAPA DE APLICACIÓN"]
        Flask[Flask API<br/>Puerto 5000]
        WS[WebSocket Server<br/>Socket.IO]
        
        Services[Servicios:<br/>Users, Patients<br/>Records, Chat]
    end
    
    subgraph Database["💾 CAPA DE DATOS"]
        PG[(PostgreSQL<br/>Usuarios, Pacientes<br/>Historiales)]
        
        MDB[(MongoDB<br/>Mensajes<br/>Conversaciones)]
    end
    
    UI -->|HTTPS/REST| Flask
    UI -->|WebSocket| WS
    
    Flask --> Services
    WS --> Services
    
    Services --> PG
    Services --> MDB
    
    style Client fill:#61dafb,stroke:#333,stroke-width:3px,color:#000
    style API fill:#3c873a,stroke:#333,stroke-width:3px,color:#fff
    style Database fill:#336791,stroke:#333,stroke-width:3px,color:#fff
```

---

## 🎨 Componentes del Sistema

### Frontend con React

Hemos construido la interfaz con React y Tailwind CSS. El flujo es sencillo: te logueas, llegas al dashboard y desde ahí puedes acceder a gestión de pacientes, chat, historial médico o configuración (si eres admin).

```mermaid
graph LR
    A[🔑 Login] --> B{Auth}
    B -->|✅| C[🏠 Dashboard]
    B -->|❌| A
    C --> D[📋 Pacientes]
    C --> E[💬 Chat]
    C --> F[📊 Historial]
    C --> G[⚙️ Config]
    
    style A fill:#4A90E2,stroke:#333,stroke-width:2px,color:#fff
    style C fill:#7ED321,stroke:#333,stroke-width:2px,color:#fff
```

### Backend con Flask

El backend es una API REST en Flask que maneja toda la lógica de negocio. Usa SQLAlchemy como ORM para PostgreSQL y PyMongo para MongoDB. La autenticación va con JWT y las contraseñas están encriptadas con bcrypt. Para el chat en tiempo real usamos Flask-SocketIO.

```mermaid
graph LR
    API[🔌 REST API] --> Auth[🔐 Auth Service]
    API --> Patient[🏥 Patient Service]
    API --> Chat[💬 Chat Service]
    
    Auth --> PG[(PostgreSQL)]
    Patient --> PG
    Chat --> MG[(MongoDB)]
    
    style API fill:#3c873a,stroke:#333,stroke-width:2px,color:#fff
    style PG fill:#336791,stroke:#333,stroke-width:2px,color:#fff
    style MG fill:#47a248,stroke:#333,stroke-width:2px,color:#fff
```

---

## 💾 Bases de Datos

Usamos dos bases de datos para aprovechar lo mejor de cada una:

- **PostgreSQL** 🐘: Para los datos importantes y estructurados (usuarios, pacientes, historiales médicos). Necesitamos las relaciones y la integridad que ofrece SQL.
  
- **MongoDB** 🍃: Para el sistema de chat. Es más flexible y rápido para manejar mensajes en tiempo real que no necesitan una estructura rígida.

```mermaid
graph TB
    subgraph PostgreSQL["🐘 PostgreSQL"]
        Users[👤 users]
        Patients[🏥 patients]
        Records[📋 medical_records]
    end
    
    subgraph MongoDB["🍃 MongoDB"]
        Msgs[💬 messages]
        Convs[📨 conversations]
    end
    
    Users -->|1:N| Records
    Patients -->|1:N| Records
    Convs -->|1:N| Msgs
    
    style PostgreSQL fill:#336791,stroke:#333,stroke-width:3px,color:#fff
    style MongoDB fill:#47a248,stroke:#333,stroke-width:3px,color:#fff
```

---

## 🔄 Cómo Funciona

El flujo típico es bastante directo: te autenticas con tu email y contraseña, el backend genera un JWT que guardas en el navegador, y con ese token haces todas las peticiones a la API. Para el chat, en lugar de HTTP usamos WebSockets para que los mensajes lleguen instantáneamente.

```mermaid
sequenceDiagram
    participant U as 👤 Usuario
    participant F as 🖥️ Frontend
    participant B as ⚙️ Backend
    participant D as 💾 DB
    
    U->>F: Login (email, password)
    F->>B: POST /api/auth/login
    B->>D: Validar credenciales
    D-->>B: Usuario válido
    B-->>F: JWT Token
    F-->>U: Redirigir a Dashboard
    
    U->>F: Buscar paciente
    F->>B: GET /api/patients (con JWT)
    B->>D: Query
    D-->>B: Resultados
    B-->>F: JSON
    F-->>U: Mostrar lista
```

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 18.2+** con Vite como bundler (mucho más rápido que Create React App)
- **Tailwind CSS** para los estilos
- **Axios** para las llamadas a la API
- **Socket.io Client** para el WebSocket del chat

### Backend
- **Python 3.9+** con **Flask 2.0+**
- **SQLAlchemy** como ORM para PostgreSQL
- **PyMongo** para conectar con MongoDB
- **Flask-SocketIO** para el servidor de WebSocket
- **PyJWT** para generar y validar tokens
- **Bcrypt** para hashear contraseñas

### Bases de Datos
- **PostgreSQL 13+** para datos estructurados
- **MongoDB 5.0+** para mensajería

### Herramientas
- Git para control de versiones
- ESLint para mantener el código limpio
- Postman para testear la API

---

## 📚 Glosario Rápido

Por si no estás familiarizado con algún término:

- **API REST**: La forma en que el frontend y backend se comunican usando HTTP (GET, POST, PUT, DELETE)
- **JWT**: Un token que se genera al hacer login y se envía en cada petición para autenticarte
- **WebSocket**: Conexión que se mantiene abierta para enviar/recibir datos en tiempo real (necesario para el chat)
- **ORM**: Una librería que te permite trabajar con la base de datos usando objetos en lugar de SQL puro
- **CRUD**: Create, Read, Update, Delete - las operaciones básicas de cualquier sistema

---

## 👥 Equipo

Este proyecto lo estamos desarrollando entre dos equipos de estudiantes de 2º DAM en el IES Ribera del Tajo.

<div align="center">

### Equipos de Desarrollo

| **LosMasones** 🔷 | **MediScout** 🔶 |
|:-------------------|:-----------------|
| **Héctor de la Llave Ballesteros** *(Leader)* | **Josue Mejías Morante** *(Leader)* |
| Pablo Moreno Márquez | Rubén Cadalso Fernández |
| Carlos López Tronco | Rubén Serrejón Porras |
| Abel González Palencia | |

</div>

---

<div align="center">

## 📄 Licencia y Documentación

[![Documentation](https://img.shields.io/badge/Docs-SRS-blue?style=for-the-badge)](./SRS.md)
[![GitHub](https://img.shields.io/badge/GitHub-dIAgnose-181717?style=for-the-badge&logo=github)](https://github.com/gzzlz/dIAgnose)

**dIAgnose** - Sistema de Gestión Hospitalaria  
*Proyecto Intermodular 2º DAM 2025-2026*  
*IES Ribera del Tajo*

</div>
