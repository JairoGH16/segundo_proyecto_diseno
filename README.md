# Finance API - Personal Finance Management System

API REST para gestión de finanzas personales desarrollada para el curso de Diseño de Software del Instituto Tecnológico de Costa Rica.

## 🏗️ Arquitectura

**Patrón de Diseño:** Repository Pattern + Service Layer

### Justificación del Patrón

Se utiliza el **Repository Pattern con Service Layer** porque:

1. **Separación de Responsabilidades:** 
   - Controllers manejan HTTP
   - Services contienen lógica de negocio
   - Repositories gestionan acceso a datos

2. **Testabilidad:** Cada capa puede ser testeada independientemente

3. **Mantenibilidad:** Cambios en DB no afectan lógica de negocio

4. **Escalabilidad:** Fácil agregar nuevas funcionalidades

## 🚀 Tecnologías

- **Node.js** + **TypeScript**
- **Express** - Framework web
- **Prisma** - ORM para PostgreSQL
- **JWT** - Autenticación
- **Swagger** - Documentación API
- **Zod** - Validación de esquemas

## 📋 Prerequisitos

- Node.js 18+
- PostgreSQL 14+
- npm o yarn

## 🔧 Instalación Local

1. Clonar repositorio:

```bash
git clone https://github.com/tu-usuario/finance-api.git
cd finance-api
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:

```bash
cp .env.example .env
# Editar .env con tus credenciales
```

4. Generar cliente Prisma y ejecutar migraciones:

```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Iniciar servidor de desarrollo:

```bash
npm run dev
```

La API estará disponible en `http://localhost:3000`
Documentación Swagger en `http://localhost:3000/api-docs`

## 📚 Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión

### Cuentas
- `GET /api/accounts` - Listar cuentas
- `POST /api/accounts` - Crear cuenta
- `GET /api/accounts/:id` - Obtener cuenta
- `PUT /api/accounts/:id` - Actualizar cuenta
- `DELETE /api/accounts/:id` - Eliminar cuenta

### Transacciones
- `GET /api/transactions` - Listar transacciones (con filtros)
- `POST /api/transactions` - Crear transacción
- `PUT /api/transactions/:id` - Actualizar transacción
- `DELETE /api/transactions/:id` - Eliminar transacción

### Presupuestos
- `GET /api/budgets` - Listar presupuestos
- `POST /api/budgets` - Crear presupuesto

### Deudas
- `GET /api/debts` - Listar deudas
- `POST /api/debts` - Crear deuda

### Garantías
- `GET /api/guarantees` - Listar garantías
- `POST /api/guarantees` - Crear garantía

## 🔐 Autenticación

La API utiliza JWT Bearer tokens:

```bash
Authorization: Bearer <tu_token_jwt>
```

## 🌐 Despliegue en Azure

### Opción 1: Azure App Service (Recomendado)

1. **Crear recursos en Azure Portal:**
   - Azure Database for PostgreSQL
   - Azure App Service (Plan gratuito F1)

2. **Configurar Azure Database:**

```bash
# En Azure Portal:
# 1. Crear PostgreSQL flexible server
# 2. Configurar firewall para permitir Azure services
# 3. Copiar connection string
```

3. **Desplegar con Azure CLI:**

```bash
# Login
az login

# Crear resource group
az group create --name finance-api-rg --location eastus

# Crear App Service plan
az appservice plan create \
  --name finance-api-plan \
  --resource-group finance-api-rg \
  --sku F1 \
  --is-linux

# Crear Web App
az webapp create \
  --resource-group finance-api-rg \
  --plan finance-api-plan \
  --name finance-api-app \
  --runtime "NODE:18-lts"

# Configurar variables de entorno
az webapp config appsettings set \
  --resource-group finance-api-rg \
  --name finance-api-app \
  --settings \
    DATABASE_URL="postgresql://..." \
    JWT_SECRET="tu-secret-produccion" \
    NODE_ENV="production"

# Deploy desde GitHub
az webapp deployment source config \
  --name finance-api-app \
  --resource-group finance-api-rg \
  --repo-url https://github.com/tu-usuario/finance-api \
  --branch main \
  --manual-integration
```

4. **Ejecutar migraciones en Azure:**

```bash
# Conectar a App Service SSH
az webapp ssh --resource-group finance-api-rg --name finance-api-app

# Ejecutar migraciones
npx prisma migrate deploy
```

### Opción 2: Azure Container Instances

1. **Crear Dockerfile:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build
RUN npx prisma generate

EXPOSE 3000

CMD ["node", "dist/app.js"]
```

2. **Build y push a Azure Container Registry:**

```bash
# Crear ACR
az acr create --resource-group finance-api-rg \
  --name financeapiregistry --sku Basic

# Build image
az acr build --registry financeapiregistry \
  --image finance-api:v1 .

# Deploy container
az container create \
  --resource-group finance-api-rg \
  --name finance-api-container \
  --image financeapiregistry.azurecr.io/finance-api:v1 \
  --dns-name-label finance-api \
  --ports 3000 \
  --environment-variables \
    DATABASE_URL="postgresql://..." \
    JWT_SECRET="tu-secret"
```

### Configuración de Dominio

En Azure App Service:
1. Custom domains → Add custom domain
2. Configure DNS records
3. Habilitar HTTPS (certificado gratuito)

## 🧪 Testing

Prueba los endpoints con:

```bash
# Registro
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Crear cuenta (usar token del login)
curl -X POST http://localhost:3000/api/accounts \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Cuenta Principal","startingAmount":1000}'
```

## 📝 Nomenclatura de Commits

```text
feat: Nueva funcionalidad
fix: Corrección de bugs
docs: Cambios en documentación
style: Formato de código
refactor: Refactorización
test: Agregar tests
chore: Tareas de mantenimiento
```

Ejemplo:
```bash
git commit -m "feat: add transaction filtering by date range"
```

## 👥 Equipo

- Jairo Jesús González Hidalgo
- Rafael Odio Mendoza

## 📄 Licencia

MIT - Instituto Tecnológico de Costa Rica