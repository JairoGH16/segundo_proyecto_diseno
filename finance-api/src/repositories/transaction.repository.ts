import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface TransactionFilters {
  accountId?: string;
  startDate?: Date;
  endDate?: Date;
  tags?: string[];
  isRecurring?: boolean;
  minAmount?: number;
  maxAmount?: number;
}

export class TransactionRepository {
  async findByUserId(userId: string, filters: TransactionFilters = {}) {
    const where: any = {
      account: { userId },
    };

    if (filters.accountId) {
      where.accountId = filters.accountId;
    }

    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) {
        where.date.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.date.lte = filters.endDate;
      }
    }

    if (filters.tags && filters.tags.length > 0) {
      where.tags = { hasSome: filters.tags };
    }

    if (filters.isRecurring !== undefined) {
      where.isRecurring = filters.isRecurring;
    }

    if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
      where.amount = {};
      if (filters.minAmount !== undefined) {
        where.amount.gte = filters.minAmount;
      }
      if (filters.maxAmount !== undefined) {
        where.amount.lte = filters.maxAmount;
      }
    }

    return prisma.transaction.findMany({
      where,
      include: { account: true },
      orderBy: { date: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.transaction.findUnique({
      where: { id },
      include: { account: true },
    });
  }

  async findByIdAndUserId(id: string, userId: string) {
    return prisma.transaction.findFirst({
      where: {
        id,
        account: { userId },
      },
      include: { account: true },
    });
  }

  async create(data: {
    description: string;
    amount: number;
    date: Date;
    tags: string[];
    accountId: string;
    isRecurring?: boolean;
    frequency?: string | null;
    endDate?: Date | null;
  }) {
    return prisma.transaction.create({
      data,
      include: { account: true },
    });
  }

  async update(
    id: string,
    data: Partial<{
      description: string;
      amount: number;
      date: Date;
      tags: string[];
      isRecurring: boolean;
      frequency: string | null;
      endDate: Date | null;
    }>
  ) {
    return prisma.transaction.update({
      where: { id },
      data,
      include: { account: true },
    });
  }

  async delete(id: string) {
    return prisma.transaction.delete({
      where: { id },
    });
  }

  async findByAccountId(accountId: string) {
    return prisma.transaction.findMany({
      where: { accountId },
      orderBy: { date: 'desc' },
    });
  }

  async findRecurring(userId: string) {
    return prisma.transaction.findMany({
      where: {
        account: { userId },
        isRecurring: true,
      },
      include: { account: true },
      orderBy: { date: 'desc' },
    });
  }

  async findByTag(userId: string, tag: string) {
    return prisma.transaction.findMany({
      where: {
        account: { userId },
        tags: { has: tag },
      },
      include: { account: true },
      orderBy: { date: 'desc' },
    });
  }

  async getStatistics(userId: string, startDate?: Date, endDate?: Date) {
    const where: any = {
      account: { userId },
    };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    const transactions = await prisma.transaction.findMany({
      where,
    });

    const income = transactions
      .filter((t: any) => t.amount > 0)
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const expenses = transactions
      .filter((t: any) => t.amount < 0)
      .reduce((sum: number, t: any) => sum + Math.abs(t.amount), 0);

    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
      transactionCount: transactions.length,
      averageTransaction:
        transactions.length > 0
          ? transactions.reduce((sum: number, t: any) => sum + t.amount, 0) /
            transactions.length
          : 0,
    };
  }
}