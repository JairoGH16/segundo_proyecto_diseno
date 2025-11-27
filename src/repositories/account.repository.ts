import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AccountRepository {
  async findByUserId(userId: string) {
    return prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.account.findUnique({
      where: { id },
    });
  }

  async findByIdAndUserId(id: string, userId: string) {
    return prisma.account.findFirst({
      where: { id, userId },
    });
  }

  async create(data: { name: string; startingAmount: number; userId: string }) {
    return prisma.account.create({
      data,
    });
  }

  async update(id: string, data: { name?: string; startingAmount?: number }) {
    return prisma.account.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.account.delete({
      where: { id },
    });
  }

  async findByIdWithTransactions(id: string, limit: number = 10) {
    return prisma.account.findUnique({
      where: { id },
      include: {
        transactions: {
          orderBy: { date: 'desc' },
          take: limit,
        },
        _count: {
          select: { transactions: true },
        },
      },
    });
  }

  async calculateBalance(accountId: string): Promise<number> {
    const account = await prisma.account.findUnique({
      where: { id: accountId },
      include: {
        transactions: true,
      },
    });

    if (!account) {
      throw new Error('Account not found');
    }

    const transactionsSum = account.transactions.reduce(
      (sum: number, t: any) => sum + t.amount,
      0
    );

    return account.startingAmount + transactionsSum;
  }

  async findByUserIdWithBalances(userId: string) {
    const accounts = await prisma.account.findMany({
      where: { userId },
      include: {
        transactions: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    return accounts.map((account: any) => {
      const balance =
        account.startingAmount +
        account.transactions.reduce(
          (sum: number, t: any) => sum + t.amount,
          0
        );

      return {
        id: account.id,
        name: account.name,
        startingAmount: account.startingAmount,
        currentBalance: balance,
        transactionCount: account._count.transactions,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      };
    });
  }
}