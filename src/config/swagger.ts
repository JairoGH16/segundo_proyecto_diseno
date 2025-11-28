import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance API',
      version: '1.0.0',
      description:
        'API REST para gestión de finanzas personales - Proyecto 2 Diseño de Software',
      contact: {
        name: 'TEC - Instituto Tecnológico de Costa Rica',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://finance-api-aybgedf7awgrash9.westus-01.azurewebsites.net',
        description: 'Production server (Azure)',
      },
    ],
    tags: [
      {
        name: 'Auth',
        description: 'Authentication endpoints',
      },
      {
        name: 'Accounts',
        description: 'Account management',
      },
      {
        name: 'Transactions',
        description: 'Transaction operations',
      },
      {
        name: 'Budgets',
        description: 'Budget management',
      },
      {
        name: 'Debts',
        description: 'Debt and loan tracking',
      },
      {
        name: 'Guarantees',
        description: 'Warranty and guarantee management',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token obtained from /api/auth/login',
        },
      },
      schemas: {
        // ============ AUTH SCHEMAS ============
        RegisterInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
            },
            password: {
              type: 'string',
              minLength: 6,
              example: 'password123',
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
            },
            password: {
              type: 'string',
              example: 'password123',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  format: 'uuid',
                },
                email: {
                  type: 'string',
                },
                name: {
                  type: 'string',
                  nullable: true,
                },
              },
            },
            token: {
              type: 'string',
              description: 'JWT token for authentication',
            },
          },
        },

        // ============ ACCOUNT SCHEMAS ============
        Account: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
            },
            startingAmount: {
              type: 'number',
              format: 'float',
            },
            userId: {
              type: 'string',
              format: 'uuid',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        CreateAccountInput: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              maxLength: 100,
              example: 'Cuenta Principal',
            },
            startingAmount: {
              type: 'number',
              format: 'float',
              default: 0,
              example: 1000,
            },
          },
        },
        UpdateAccountInput: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              maxLength: 100,
              example: 'Cuenta Actualizada',
            },
            startingAmount: {
              type: 'number',
              format: 'float',
              example: 1500,
            },
          },
        },

        // ============ TRANSACTION SCHEMAS ============
        Transaction: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            description: {
              type: 'string',
            },
            amount: {
              type: 'number',
              format: 'float',
            },
            date: {
              type: 'string',
              format: 'date-time',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            accountId: {
              type: 'string',
              format: 'uuid',
            },
            isRecurring: {
              type: 'boolean',
            },
            frequency: {
              type: 'string',
              nullable: true,
            },
            endDate: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        CreateTransactionInput: {
          type: 'object',
          required: ['description', 'amount', 'date', 'accountId'],
          properties: {
            description: {
              type: 'string',
              example: 'Compra en supermercado',
            },
            amount: {
              type: 'number',
              format: 'float',
              example: -50.5,
              description: 'Positive for income, negative for expense',
            },
            date: {
              type: 'string',
              format: 'date',
              example: '2025-11-26',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['food', 'groceries'],
            },
            accountId: {
              type: 'string',
              format: 'uuid',
            },
            isRecurring: {
              type: 'boolean',
              default: false,
            },
            frequency: {
              type: 'string',
              enum: ['daily', 'weekly', 'bi-weekly', 'monthly', 'quarterly', 'annually'],
              example: 'monthly',
            },
            endDate: {
              type: 'string',
              format: 'date',
              example: '2026-11-26',
            },
          },
        },
        UpdateTransactionInput: {
          type: 'object',
          properties: {
            description: {
              type: 'string',
            },
            amount: {
              type: 'number',
              format: 'float',
            },
            date: {
              type: 'string',
              format: 'date',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            isRecurring: {
              type: 'boolean',
            },
            frequency: {
              type: 'string',
            },
            endDate: {
              type: 'string',
              format: 'date',
            },
          },
        },

        // ============ BUDGET SCHEMAS ============
        Budget: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
            },
            limit: {
              type: 'number',
              format: 'float',
            },
            tag: {
              type: 'string',
            },
            startDate: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            endDate: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            userId: {
              type: 'string',
              format: 'uuid',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        CreateBudgetInput: {
          type: 'object',
          required: ['name', 'limit', 'tag'],
          properties: {
            name: {
              type: 'string',
              example: 'Presupuesto Alimentación',
            },
            limit: {
              type: 'number',
              format: 'float',
              example: 500,
              description: 'Budget limit amount',
            },
            tag: {
              type: 'string',
              example: 'food',
              description: 'Tag to track against this budget',
            },
            startDate: {
              type: 'string',
              format: 'date',
              example: '2025-01-01',
            },
            endDate: {
              type: 'string',
              format: 'date',
              example: '2025-12-31',
            },
          },
        },

        // ============ DEBT SCHEMAS ============
        Debt: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
            },
            lender: {
              type: 'string',
            },
            principal: {
              type: 'number',
              format: 'float',
            },
            interestRate: {
              type: 'number',
              format: 'float',
            },
            startDate: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
            },
            userId: {
              type: 'string',
              format: 'uuid',
            },
            payments: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Payment',
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Payment: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            amount: {
              type: 'number',
              format: 'float',
            },
            date: {
              type: 'string',
              format: 'date-time',
            },
            debtId: {
              type: 'string',
              format: 'uuid',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        CreateDebtInput: {
          type: 'object',
          required: ['name', 'lender', 'principal', 'dueDate'],
          properties: {
            name: {
              type: 'string',
              example: 'Préstamo Personal',
            },
            lender: {
              type: 'string',
              example: 'Banco Nacional',
            },
            principal: {
              type: 'number',
              format: 'float',
              example: 10000,
              description: 'Original loan amount',
            },
            interestRate: {
              type: 'number',
              format: 'float',
              example: 5.5,
              default: 0,
              description: 'Annual interest rate percentage',
            },
            startDate: {
              type: 'string',
              format: 'date',
              example: '2025-01-01',
            },
            dueDate: {
              type: 'string',
              format: 'date',
              example: '2026-01-01',
            },
          },
        },

        // ============ GUARANTEE SCHEMAS ============
        Guarantee: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
            },
            description: {
              type: 'string',
              nullable: true,
            },
            amount: {
              type: 'number',
              format: 'float',
              description: 'Amount of guarantee (can be 0 for included warranties)',
            },
            expiryDate: {
              type: 'string',
              format: 'date-time',
            },
            userId: {
              type: 'string',
              format: 'uuid',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        CreateGuaranteeInput: {
          type: 'object',
          required: ['name', 'amount', 'expiryDate'],
          properties: {
            name: {
              type: 'string',
              example: 'Garantía de Laptop',
            },
            description: {
              type: 'string',
              example: 'Garantía extendida de 2 años',
            },
            amount: {
              type: 'number',
              format: 'float',
              minimum: 0,
              example: 0,
              description: 'Amount paid for guarantee (0 for included warranties)',
            },
            expiryDate: {
              type: 'string',
              format: 'date',
              example: '2027-11-26',
            },
          },
        },

        // ============ ERROR SCHEMAS ============
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Error message',
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                  },
                  message: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Validation failed',
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                  },
                  message: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../routes/*.ts'),
    path.join(__dirname, '../controllers/*.js'),
    path.join(__dirname, '../controllers/*.ts'),
  ],
};

export const swaggerSpec = swaggerJsdoc(options);