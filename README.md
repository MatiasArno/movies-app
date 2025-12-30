# 🎬 Movies API Backend

Backend robusto desarrollado con **NestJS**, diseñado para gestionar un catálogo de películas sincronizado con la API pública de Star Wars (SWAPI), ofreciendo funcionalidades de autenticación, roles de usuario y persistencia de datos.

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE0902?style=for-the-badge&logo=typeorm&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white)

---

## 🚀 Despliegue (Live Demo)

El proyecto se encuentra desplegado y funcional en **Render.com**.

#### ⚠️ IMPORTANTE: El servidor se duerme por inactividad. El primer request tarda más de un minuto en responder ⚠️

- **API Base URL:** `https://movies-app-yvyp.onrender.com/api/v1`
- **Documentación Swagger:** `https://movies-app-yvyp.onrender.com/api/docs`
- **Health Check:** `https://movies-app-yvyp.onrender.com/api/v1/status`

---

## 📋 Características Principales

- **Arquitectura Modular:** Basada en capas (Controller, Service, Repository) y Vertical Slicing.
- **Autenticación & Seguridad:**
  - Login/Registro con **JWT (JSON Web Token)**.
  - Hashing de contraseñas con `bcrypt`.
  - **RBAC (Role-Based Access Control):** Diferenciación entre usuarios `ADMIN` y `REGULAR`.
  - Protección de endpoints mediante `Guards` y Decoradores personalizados.
- **Integración Externa (Adapter Pattern):**
  - Conexión con **SWAPI** (Star Wars API).
  - Patrón Adaptador para aislar la lógica externa del dominio interno.
  - Sincronización automática (Cron Jobs) y manual de películas.
- **Base de Datos:**
  - PostgreSQL (alojada en Neon.tech).
  - ORM: TypeORM con Entidades y Repositorios.
- **Calidad de Código:**
  - Validación de datos de entrada (DTOs) con `class-validator`.
  - Manejo global de errores y logs centralizados.
  - Variables de entorno tipadas y validadas con `Joi`.
  - **Unit Testing:** Cobertura de lógica de negocio crítica con Jest.

---

## 🛠️ Stack Tecnológico

- **Core:** NestJS 11, TypeScript.
- **Base de Datos:** PostgreSQL, TypeORM.
- **Seguridad:** Passport, JWT, Helmet, Bcrypt.
- **Documentación:** Swagger (OpenAPI).
- **Testing:** Jest.
- **Infraestructura:** Render (App), Neon (DB).

---

## ⚙️ Instalación y Ejecución Local

### 1. Prerrequisitos

- Node.js (v18 o superior)
- npm o pnpm
- Una instancia de PostgreSQL (Local o Docker)

### 2. Clonar el repositorio

```bash
git clone https://github.com/MatiasArno/movies-app
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basándote en el siguiente esquema:

```env
# APP
PORT = 3000
NODE_ENV = development

# DATABASE (PostgreSQL)
DB_HOST = localhost
DB_PORT = 5432
DB_USERNAME = postgres
DB_PASSWORD = tu_password
DB_NAME = movies_db
DB_SSL = false

# SECURITY
JWT_SECRET = tu_secreto_super_seguro
ADMIN_SECRET_KEY = clave_secreta_para_crear_admins

# EXTERNAL APIS
SWAPI_URL = https://www.swapi.tech/api
```

### 5. Iniciar el servidor (Development)

```bash
npm run start:dev
```

La aplicación estará disponible en `http://localhost:3000/api/v1`.

---

## 🧪 Testing

El proyecto cuenta con pruebas unitarias para asegurar la integridad de los servicios críticos (Auth, Movies, Sincronización).

```bash
# Ejecutar tests unitarios
npm run test
```

---

## 📚 Documentación de API (Endpoints)

Puedes ver y probar todos los endpoints interactivos ingresando a `/api/docs` una vez levantada la aplicación.

### Resumen de Endpoints Clave:

| Método   | Endpoint         | Rol Requerido | Descripción                            |
| :------- | :--------------- | :------------ | :------------------------------------- |
| `POST`   | `/auth/register` | Público       | Registrar usuario (Regular o Admin\*). |
| `POST`   | `/auth/login`    | Público       | Obtener Token JWT.                     |
| `GET`    | `/movies`        | **Público**   | Listar catálogo de películas.          |
| `GET`    | `/movies/:id`    | Auth (Todos)  | Ver detalle de una película.           |
| `POST`   | `/movies`        | **Admin**     | Crear película manualmente.            |
| `PATCH`  | `/movies/:id`    | **Admin**     | Editar película.                       |
| `DELETE` | `/movies/:id`    | **Admin**     | Eliminar película.                     |
| `POST`   | `/movies/sync`   | **Admin**     | Forzar sincronización con SWAPI.       |

_> Para registrar un usuario ADMIN, es necesario enviar el campo `adminSecret` en el body con el valor configurado en el `.env`._

---

## 🏗️ Arquitectura del Proyecto

El proyecto sigue una arquitectura modular con separación de responsabilidades:

```text
src/
|-- common/          # Decoradores, filtros, interceptores y middlewares globales
|-- config/          # Validación y tipado de variables de entorno
|-- modules/
|   |-- auth/        # Lógica de JWT, Guards y Strategies
|   |-- movies/      # Dominio principal (CRUD y Sync Logic)
|   |-- swapi/       # Módulo de Infraestructura (Adaptador HTTP)
|   |-- users/       # Gestión de usuarios y roles
|-- app.module.ts    # Orquestador principal
|-- main.ts          # Punto de entrada (Configuración global)
```

---

**Desarrollado con ❤️ usando NestJS.**
