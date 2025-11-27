import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateTransactionData {
  description: string;
  amount: number;
  date: string;
  tags?: string[];
  accountId: string;
  isRecurring?: boolean;
  frequency?: string;
  endDate?: string;
}

interface TransactionFilters {
  accountId?: string;
  startDate?: string;
  endDate?: string;
  tags?: string[];
}

export class TransactionService {
  async getAll(userId: string, filters: TransactionFilters) {
    const where: any = {
      account: { userId },
    };

    if (filters.accountId) {
      where.accountId = filters.accountId;
    }

    if (filters.startDate) {
      where.date = { ...where.date, gte: new Date(filters.startDate) };
    }

    if (filters.endDate) {
      where.date = { ...where.date, lte: new Date(filters.endDate) };
    }

    if (filters.tags && filters.tags.length > 0) {
      where.tags = { hasSome: filters.tags };
    }

    return prisma.transaction.findMany({
      where,
      include: { account: true },
      orderBy: { date: 'desc' },
    });
  }

  async create(userId: string, data: CreateTransactionData) {
    // Verify account belongs to user
    const account = await prisma.account.findFirst({
      where: { id: data.accountId, userId },
    });

    if (!account) {
      throw new Error('Account not found or unauthorized');
    }

    return prisma.transaction.create({
      data: {
        description: data.description,
        amount: data.amount,
        date: new Date(data.date),
        tags: data.tags || [],
        accountId: data.accountId,
        isRecurring: data.isRecurring || false,
        frequency: data.frequency,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });
  }

  async update(id: string, userId: string, data: Partial<CreateTransactionData>) {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        account: { userId },
      },
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return prisma.transaction.update({
      where: { id },
      data: {
        ...(data.description && { description: data.description }),
        ...(data.amount !== undefined && { amount: data.amount }),
        ...(data.date && { date: new Date(data.date) }),
        ...(data.tags && { tags: data.tags }),
        ...(data.isRecurring !== undefined && { isRecurring: data.isRecurring }),
        ...(data.frequency && { frequency: data.frequency }),
        ...(data.endDate && { endDate: new Date(data.endDate) }),
      },
    });
  }

  async delete(id: string, userId: string) {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        account: { userId },
      },
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return prisma.transaction.delete({
      where: { id },
    });
  }
}