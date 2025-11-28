export const swaggerSchemas = {
  // ==================== AUTH SCHEMAS ====================
  RegisterRequest: {
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
        example: 'SecurePass123',
      },
      name: {
        type: 'string',
        example: 'John Doe',
      },
    },
  },
  LoginRequest: {
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
        example: 'SecurePass123',
      },
    },
  },
  AuthResponse: {
    type: 'object',
    properties: {
      user: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email' },
          name: { type: 'string' },
        },
      },
      token: {
        type: 'string',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  },

  // ==================== ACCOUNT SCHEMAS ====================
  Account: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string', example: 'Cuenta Principal' },
      startingAmount: { type: 'number', example: 1000.0 },
      userId: { type: 'string', format: 'uuid' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  CreateAccount: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string', example: 'Cuenta de Ahorros' },
      startingAmount: { type: 'number', default: 0, example: 5000.0 },
    },
  },
  UpdateAccount: {
    type: 'object',
    properties: {
      name: { type: 'string', example: 'Cuenta Actualizada' },
      startingAmount: { type: 'number', example: 5000.0 },
    },
  },

  // ==================== TRANSACTION SCHEMAS ====================
  Transaction: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      description: { type: 'string', example: 'Compra de supermercado' },
      amount: { type: 'number', example: -50.75 },
      date: { type: 'string', format: 'date' },
      tags: {
        type: 'array',
        items: { type: 'string' },
        example: ['food', 'groceries'],
      },
      accountId: { type: 'string', format: 'uuid' },
      isRecurring: { type: 'boolean', default: false },
      frequency: {
        type: 'string',
        enum: ['daily', 'weekly', 'bi-weekly', 'monthly', 'quarterly', 'annually'],
      },
      endDate: { type: 'string', format: 'date' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  CreateTransaction: {
    type: 'object',
    required: ['description', 'amount', 'date', 'accountId'],
    properties: {
      description: { type: 'string', example: 'Pago de servicios' },
      amount: {
        type: 'number',
        example: -150.0,
        description: 'Positivo para ingresos, negativo para gastos',
      },
      date: { type: 'string', format: 'date', example: '2025-11-28' },
      tags: {
        type: 'array',
        items: { type: 'string' },
        example: ['utilities', 'electricity'],
      },
      accountId: { type: 'string', format: 'uuid' },
      isRecurring: { type: 'boolean', default: false },
      frequency: { type: 'string', enum: ['monthly', 'weekly', 'bi-weekly', 'quarterly', 'annually'] },
      endDate: { type: 'string', format: 'date' },
    },
  },

  // ==================== BUDGET SCHEMAS ====================
  Budget: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string', example: 'Presupuesto Mensual Alimentos' },
      limit: { type: 'number', example: 500.0 },
      tag: { type: 'string', example: 'food' },
      startDate: { type: 'string', format: 'date' },
      endDate: { type: 'string', format: 'date' },
      userId: { type: 'string', format: 'uuid' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  CreateBudget: {
    type: 'object',
    required: ['name', 'limit', 'tag'],
    properties: {
      name: { type: 'string', example: 'Presupuesto Entretenimiento' },
      limit: { type: 'number', example: 300.0, minimum: 0 },
      tag: { type: 'string', example: 'entertainment' },
      startDate: { type: 'string', format: 'date', example: '2025-11-01' },
      endDate: { type: 'string', format: 'date', example: '2025-11-30' },
    },
  },

  // ==================== DEBT SCHEMAS ====================
  Debt: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string', example: 'Préstamo Personal' },
      lender: { type: 'string', example: 'Banco Nacional' },
      principal: { type: 'number', example: 10000.0 },
      interestRate: { type: 'number', example: 5.5, description: 'Tasa de interés en %' },
      startDate: { type: 'string', format: 'date' },
      dueDate: { type: 'string', format: 'date' },
      userId: { type: 'string', format: 'uuid' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
      payments: {
        type: 'array',
        items: { $ref: '#/components/schemas/Payment' },
      },
    },
  },
  CreateDebt: {
    type: 'object',
    required: ['name', 'lender', 'principal', 'dueDate'],
    properties: {
      name: { type: 'string', example: 'Préstamo Automóvil' },
      lender: { type: 'string', example: 'BAC San José' },
      principal: { type: 'number', example: 15000.0, minimum: 0 },
      interestRate: { type: 'number', default: 0, example: 6.5, minimum: 0, maximum: 100 },
      startDate: { type: 'string', format: 'date', example: '2025-01-01' },
      dueDate: { type: 'string', format: 'date', example: '2030-01-01' },
    },
  },
  Payment: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      amount: { type: 'number', example: 500.0 },
      date: { type: 'string', format: 'date' },
      debtId: { type: 'string', format: 'uuid' },
      createdAt: { type: 'string', format: 'date-time' },
    },
  },

  // ==================== GUARANTEE SCHEMAS ====================
  Guarantee: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string', example: 'Garantía Laptop Dell' },
      description: { type: 'string', example: 'Garantía extendida por 3 años' },
      amount: { type: 'number', example: 0, description: '0 si viene incluida, monto si fue comprada por separado' },
      expiryDate: { type: 'string', format: 'date' },
      userId: { type: 'string', format: 'uuid' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  CreateGuarantee: {
    type: 'object',
    required: ['name', 'amount', 'expiryDate'],
    properties: {
      name: { type: 'string', example: 'Garantía iPhone 15' },
      description: { type: 'string', example: 'AppleCare+ con cobertura de daños accidentales' },
      amount: {
        type: 'number',
        example: 0,
        minimum: 0,
        description: 'Usar 0 para garantías incluidas sin costo',
      },
      expiryDate: { type: 'string', format: 'date', example: '2027-11-28' },
    },
  },

  // ==================== ERROR SCHEMAS ====================
  Error: {
    type: 'object',
    properties: {
      error: { type: 'string', example: 'Error message' },
      details: { type: 'array', items: { type: 'object' } },
    },
  },
};