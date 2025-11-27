import { Request } from 'express';

// Extend Express Request with user info
export interface AuthenticatedRequest extends Request {
  userId?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

// DTOs (Data Transfer Objects)
export interface RegisterDTO {
  email: string;
  password: string;
  name?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface CreateAccountDTO {
  name: string;
  startingAmount?: number;
}

export interface UpdateAccountDTO {
  name?: string;
  startingAmount?: number;
}

export interface CreateTransactionDTO {
  description: string;
  amount: number;
  date: string | Date;
  tags?: string[];
  accountId: string;
  isRecurring?: boolean;
  frequency?: string;
  endDate?: string | Date;
}

export interface UpdateTransactionDTO {
  description?: string;
  amount?: number;
  date?: string | Date;
  tags?: string[];
  isRecurring?: boolean;
  frequency?: string;
  endDate?: string | Date;
}

export interface TransactionFilterDTO {
  accountId?: string;
  startDate?: string;
  endDate?: string;
  tags?: string[];
  isRecurring?: boolean;
  minAmount?: number;
  maxAmount?: number;
}

export interface CreateBudgetDTO {
  name: string;
  limit: number;
  tag: string;
  startDate?: string | Date;
  endDate?: string | Date;
}

export interface CreateDebtDTO {
  name: string;
  lender: string;
  principal: number;
  interestRate?: number;
  startDate?: string | Date;
  dueDate: string | Date;
}

export interface CreatePaymentDTO {
  amount: number;
  date: string | Date;
  debtId: string;
}

export interface CreateGuaranteeDTO {
  name: string;
  description?: string;
  amount: number;
  expiryDate: string | Date;
}

// Response types
export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name?: string;
  };
  token: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  error: string;
  details?: any;
  statusCode?: number;
}

// Custom Error Classes
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

// Enums
export enum TransactionFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  BI_WEEKLY = 'bi-weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUALLY = 'annually',
}

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

// Helper type for Prisma includes
export type AccountWithTransactions = {
  id: string;
  name: string;
  startingAmount: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  transactions: Array<{
    id: string;
    description: string;
    amount: number;
    date: Date;
    tags: string[];
  }>;
};

export type DebtWithPayments = {
  id: string;
  name: string;
  lender: string;
  principal: number;
  interestRate: number;
  startDate: Date | null;
  dueDate: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  payments: Array<{
    id: string;
    amount: number;
    date: Date;
    debtId: string;
    createdAt: Date;
  }>;
};