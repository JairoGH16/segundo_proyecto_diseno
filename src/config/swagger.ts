import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerSchemas } from './swaggerSchemas';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance API',
      version: '1.0.0',
      description:
        'API REST para gestión de finanzas personales - Proyecto 2 Diseño de Software TEC',
      contact: {
        name: 'Instituto Tecnológico de Costa Rica',
        url: 'https://www.tec.ac.cr',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://your-azure-app.azurewebsites.net',
        description: 'Production server (Azure)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingrese el token JWT obtenido del login',
        },
      },
      schemas: swaggerSchemas,
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Auth',
        description: 'Endpoints de autenticación',
      },
      {
        name: 'Accounts',
        description: 'Gestión de cuentas bancarias',
      },
      {
        name: 'Transactions',
        description: 'Gestión de transacciones (ingresos y gastos)',
      },
      {
        name: 'Budgets',
        description: 'Gestión de presupuestos',
      },
      {
        name: 'Debts',
        description: 'Gestión de deudas y préstamos',
      },
      {
        name: 'Guarantees',
        description: 'Gestión de garantías de productos',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);