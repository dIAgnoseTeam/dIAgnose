# 🏥 dIAgnose


[![Status](https://img.shields.io/badge/Status-In%20Development-yellow)](https://github.com/dIAgnoseTeam/dIAgnose)
[![Version](https://img.shields.io/badge/Version-1.0-green)](https://github.com/dIAgnoseTeam/dIAgnose)

**dIAgnose** el chat avanzado para el diagnostico de los pacientes.

---

## 📋 Índice

1. [Visión General](#-visión-general)
2. [Arquitectura del Sistema](#-arquitectura-del-sistema)
3. [Componentes Principales](#-componentes-principales)
4. [Base de Datos](#-base-de-datos)
5. [Flujo de Usuario](#-flujo-de-usuario)
6. [Tecnologías Utilizadas](#️-tecnologías-utilizadas)
7. [Glosario Técnico](#-glosario-técnico-simplificado)
8. [Agradecimientos](#-diagnose---el-futuro-del-diagnóstico-médico)

---

## 🎯 Visión General

**dIAgnose** es una aplicación hospitalaria de última generación que integra inteligencia artificial para asistir en el proceso de diagnóstico médico. El sistema combina la experiencia médica tradicional con el poder del análisis predictivo basado en IA.

### Características Principales

✨ **Diagnóstico Asistido por IA** - Modelo de IA entrenado para sugerir diagnósticos basados en síntomas  
👥 **Gestión de Pacientes** - Administración completa de historiales médicos  
💬 **Sistema de Chat** - Comunicación en tiempo real entre profesionales  
🔐 **Seguridad Avanzada** - Autenticación robusta y protección de datos sensibles  
📊 **Historial Completo** - Seguimiento detallado de consultas y tratamientos

---

## 🏗️ Arquitectura del Sistema

El sistema dIAgnose está construido sobre una arquitectura de **tres capas** que garantiza escalabilidad, mantenibilidad y alto rendimiento:

```
    FRONT-END      ────▶      BACKEND       ────▶      BASE DE DATOS  
    (Cliente)      ◀────     (Servidor)     ◀────       (Almacén)     


```

---

## 🎨 Componentes Principales

### 🖥️ **FRONT-END** - La Interfaz del Usuario

#### 📱 Módulos de Interfaz

| Módulo | Descripción | Acceso |
|--------|-------------|---------|
| 🔑 **LOGIN FORM** | Portal de acceso seguro al sistema | Todos los usuarios |
| 🏠 **HOME PAGE** | Panel principal con vista general | Usuario autenticado |
| ⚙️ **CONFIGURACIÓN** | Ajustes personalizados del sistema | Solo administradores |
| 📖 **HISTORIAL** | Registro completo de consultas | Médicos autorizados |
| 💬 **CHATS** | Mensajería entre profesionales | Todos los usuarios |
| 👤 **ADMIN PACIENTES** | Gestión de información de pacientes | Personal autorizado |

#### 🔄 Flujo de Navegación

```
LOGIN → HOME PAGE (si médico) → Módulos disponibles según permisos
```

---

### ⚙️ **BACKEND** - El Motor del Sistema

#### 🔌 Servicios Core

##### 1️⃣ **Servicio de Endpoints REST API**

**¿Qué es?** Es como un "menú de opciones" que permite al front-end solicitar información o realizar acciones.

**Funciones principales:**
- 🔐 Validación de credenciales (LOGIN)
- 🔑 Gestión de sesiones con JWT (tokens seguros)
- 🔌 Uso de WebSocket para chat en tiempo real

**Tecnología:** REST API permite que diferentes partes del sistema "hablen entre sí" usando solicitudes HTTP estándar (GET, POST, PUT, DELETE).

---

##### 2️⃣ **Conexiones y Modelos de BD**

**¿Qué es?** El intermediario que traduce las peticiones del sistema al "idioma" que entiende la base de datos.

**Funciones principales:**
- 🔗 Establece conexiones seguras con las bases de datos
- 📊 Define la estructura de los datos (modelos)
- ✅ Valida que la información sea correcta antes de guardarla
- 🔄 Realiza operaciones CRUD (Crear, Leer, Actualizar, Eliminar)

---

### 🧠 **MODELO DE IA** - La Inteligencia Artificial

#### ¿Cómo funciona?

```
Síntomas del paciente → Modelo de IA → Diagnósticos sugeridos
                                     → Nivel de confianza
                                     → Recomendaciones
```

**Pipeline de IA:**
1. 📥 **Entrada:** Síntomas, signos vitales, historial
2. 🧮 **Procesamiento:** Análisis mediante algoritmos de Machine Learning
3. 📤 **Salida:** Diagnósticos posibles ordenados por probabilidad

---

## 💾 Base de Datos

### 🗄️ **Estructura de Almacenamiento Multi-Base**

El sistema utiliza una estrategia de **bases de datos especializadas** para optimizar rendimiento y organización:

#### 1️⃣ **Base de Datos SQL Principal**

**Propósito:** Almacenamiento estructurado de datos críticos

**Contenido:**
- 👤 Información de usuarios (médicos, enfermeros, administradores)
- 📋 Perfiles de pacientes
- 🔐 Roles y permisos de acceso

**¿Por qué SQL?** Garantiza integridad de datos mediante relaciones y transacciones ACID.

---

#### 2️⃣ **Base de Datos NoSQL para Chats**

**Propósito:** Almacenamiento flexible de conversaciones

**Contenido:**
- 💬 Mensajes de chat en tiempo real
- 👥 Historial de conversaciones
- 📎 Archivos adjuntos
- ✅ Estado de lectura

**¿Por qué NoSQL?** Permite escalabilidad horizontal y manejo eficiente de grandes volúmenes de mensajes no estructurados.

---

#### 3️⃣ **Base de Datos Vectorial para IA**

**Propósito:** Almacenamiento semántico para el modelo de inteligencia artificial

**Contenido:**
- 🔢 Embeddings de síntomas y diagnósticos
- 📊 Vectores de características clínicas
- 🧬 Patrones de enfermedades codificados
- 🔗 Relaciones semánticas entre conceptos médicos

**¿Qué son vectores?** Representaciones numéricas que capturan el "significado" de conceptos médicos, permitiendo búsquedas por similitud.

**¿Por qué Vectorial?** El modelo de IA puede encontrar rápidamente casos similares y patrones ocultos mediante búsquedas de similitud vectorial.

---

## 🔄 Flujo de Usuario

### 📊 Diagrama de Interacción

```mermaid
    A --> 1. Usuario | 🔐 Autenticación
    B --> 2. Token JWT | 🏠 Dashboard
    C --> 3. Selecciona Paciente | 📋 Historial
    D --> 4. Ingresa Síntomas | 🧠 Modelo IA
    E --> 5. Diagnóstico Sugerido | 👨‍⚕️ Médico
    F --> 6. Confirma/Ajusta | 💾 Guarda en BD
```

### 🎬 Casos de Uso Principales

#### 🩺 Caso 1: Diagnóstico Asistido

1. **Médico** accede al perfil del paciente
2. Ingresa síntomas y signos vitales
3. **IA** procesa información y sugiere diagnósticos
4. Médico revisa sugerencias y toma decisión final
5. Sistema registra diagnóstico y tratamiento

#### 💬 Caso 2: Consulta entre Colegas

1. **Médico A** abre chat con **Médico B**
2. Envía pregunta sobre caso complejo
3. Sistema notifica en tiempo real a **Médico B**
4. Intercambian información de forma segura
5. Conversación queda registrada (si es necesario)

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- ⚛️ **React** - Framework moderno de UI
- 🎨 **Tailwind CSS** - Estilos responsive y modernos

### Backend
- 🟢 **Python + Flask**
- 🔐 **JWT** - Autenticación segura
- 🔌 **WebSocket** - Comunicación en tiempo real

### Bases de Datos
- 🐘 **PostgreSQL** - Base de datos SQL principal
- 🍃 **MongoDB** - Base de datos NoSQL para chats
- 🔍 **Qdrant/ElasticSearch** - Base de datos vectorial

---

## 🎓 Glosario Técnico Simplificado

| Término | Explicación Simple |
|---------|-------------------|
| **API REST** | Sistema que permite comunicación entre programas usando solicitudes web estándar |
| **JWT** | "Pasaporte digital" que demuestra que el usuario está autenticado |
| **WebSocket** | Canal de comunicación bidireccional para mensajes instantáneos |
| **CRUD** | Operaciones básicas: Crear, Leer, Actualizar, Borrar |
| **Embeddings** | Traducción de palabras/conceptos a números que la IA puede procesar |
| **Vectorial** | Base de datos que guarda información como coordenadas numéricas |
| **NoSQL** | Base de datos flexible sin estructura rígida de tablas |
| **Cluster** | Grupo de servidores que trabajan juntos para mayor potencia |

---

## 🌟 ¡dIAgnose - El Futuro del Diagnóstico Médico!

**Desarrollado con ❤️ por LosMasones y MediScout**

- LosMasones
    - Héctor de la Llave Ballesteros (Leader)
    - Abel González Palencia
    - Carlos López Tronco
    - Pablo Moreno Márquez
- MediScout
    - Josue Mejías Morante (Leader)
    - Rubén Cadalso Fernandez
    - Rubén Serrejón Porras