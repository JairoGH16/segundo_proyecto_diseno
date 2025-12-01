# Finance API - Proyecto 2 Diseño de Software

API REST para la gestión de finanzas personales, desarrollada como parte del curso de Diseño de Software del Instituto Tecnológico de Costa Rica. Este proyecto implementa un servicio API HTTP con autenticación JWT, documentación Swagger, y despliegue en Azure, siguiendo un patrón de diseño justificado.

## 👥 Equipo
- Jairo Jesús González Hidalgo
- Rafael Odio Mendoza

## 🏗️ Arquitectura y Estructura
El proyecto está organizado en un patrón de **Repository Pattern + Service Layer**.

- **Controllers:** Manejan las solicitudes y respuestas HTTP, y la validación inicial de los datos de entrada.
- **Services:** Contienen la lógica de negocio principal y coordinan las operaciones entre los controladores y los repositorios.
- **Repositories:** Encapsulan la lógica para acceder y manipular los datos de la base de datos (PostgreSQL a través de Prisma ORM).
- **Middleware:** Gestiona la autenticación JWT y el manejo centralizado de errores.
- **Routes:** Definen las rutas de la API.
- **Utils:** Contiene funciones de utilidad (JWT, validación).
- **Config:** Configuración de la base de datos y Swagger.

## 🚀 Tecnologías Principales
- **Backend:** Node.js, TypeScript, Express.js
- **Base de Datos:** PostgreSQL con Prisma ORM
- **Autenticación:** JSON Web Tokens (JWT)
- **Validación:** Zod
- **Documentación:** Swagger/OpenAPI
- **Despliegue:** Azure App Service

## 📋 Pre-requisitos
- Node.js (versión 18 o superior)
- PostgreSQL
- npm o yarn
- Docker (opcional, para PostgreSQL local)
- Azure CLI (para despliegue en Azure)

## 🔧 Instalación y Ejecución Local

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/JairoGH16/segundo_proyecto_diseno.git
    cd finance-api
    ```
2.  **Instalar dependencias:**
    ```bash
    npm install
    ```
3.  **Configurar variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto copiando `.env.example` y actualiza los valores, especialmente `DATABASE_URL` para tu instancia de PostgreSQL.
    ```bash
    cp .env.example .env
    ```
4.  **Inicializar la base de datos:**
    Asegúrate de que tu servidor PostgreSQL esté corriendo.
    ```bash
    npx prisma db push
    ```
5.  **Ejecutar el servidor:**
    ```bash
    npm run dev
    ```
    La API estará disponible en `http://localhost:3000`.

## 📚 Endpoints Implementados (Más de 10)

Los siguientes endpoints están protegidos por autenticación JWT, a menos que se indique lo contrario.

### Autenticación (2)
- `POST /api/auth/register`: Registra un nuevo usuario.
- `POST /api/auth/login`: Autentica un usuario y devuelve un JWT.

### Cuentas (5)
- `GET /api/accounts`: Obtiene todas las cuentas del usuario autenticado.
- `POST /api/accounts`: Crea una nueva cuenta.
- `GET /api/accounts/:id`: Obtiene los detalles de una cuenta específica.
- `PUT /api/accounts/:id`: Actualiza una cuenta existente.
- `DELETE /api/accounts/:id`: Elimina una cuenta.

### Transacciones (4)
- `GET /api/transactions`: Obtiene todas las transacciones del usuario, con soporte para filtros (por cuenta, fecha, tags).
- `POST /api/transactions`: Crea una nueva transacción.
- `PUT /api/transactions/:id`: Actualiza una transacción existente.
- `DELETE /api/transactions/:id`: Elimina una transacción.

### Presupuestos (2)
- `GET /api/budgets`: Obtiene todos los presupuestos del usuario.
- `POST /api/budgets`: Crea un nuevo presupuesto.

### Deudas (2)
- `GET /api/debts`: Obtiene todas las deudas del usuario.
- `POST /api/debts`: Crea una nueva deuda.

### Garantías (2)
- `GET /api/guarantees`: Obtiene todas las garantías del usuario.
- `POST /api/guarantees`: Crea una nueva garantía.

## 🔐 Autenticación
Todos los endpoints protegidos requieren un JSON Web Token (JWT) válido en el encabezado `Authorization` con el formato `Bearer <YOUR_JWT_TOKEN>`. El token se obtiene al realizar el login.

## 📄 Documentación API (Swagger)
La documentación interactiva de la API está disponible en:
- **Local:** `http://localhost:3000/api-docs`
- **Azure:** `https://finance-api-aybgedf7awgrash9.westus-01.azurewebsites.net/api-docs`

El archivo OpenAPI Spec (JSON) también está disponible en `/api-docs.json`.

## 🌐 Despliegue en Azure
El servicio está desplegado en **Azure App Service** utilizando una base de datos **Azure Database for PostgreSQL**. Los detalles del proceso de despliegue se encuentran en el archivo `README.md` original, incluyendo la configuración de Azure CLI y los comandos para crear recursos y desplegar la aplicación.

- **URL de la API Desplegada:** `https://finance-api-aybgedf7awgrash9.westus-01.azurewebsites.net` (Reemplazar con la URL real de tu instancia en Azure).

## 📝 Nomenclatura de Commits
Se sigue la convención de Conventional Commits. Ejemplos:
- `feat: implementar autenticación de usuario`
- `fix: corregir error al crear cuenta`
- `docs: actualizar documentación swagger`

## 📄 Licencia
MIT - Instituto Tecnológico de Costa Rica