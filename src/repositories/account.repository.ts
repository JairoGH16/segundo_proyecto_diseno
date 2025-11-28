import { PrismaClient, Account } from '@prisma/client';

const prisma = new PrismaClient();

export class AccountRepository {
  /**
   * Find all accounts for a user
   */
  async findByUserId(userId: string): Promise<Account[]> {
    return prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find account by ID
   */
  async findById(id: string): Promise<Account | null> {
    return prisma.account.findUnique({
      where: { id },
    });
  }

  /**
   * Find account by ID and user ID
   */
  async findByIdAndUserId(
    id: string,
    userId: string
  ): Promise<Account | null> {
    return prisma.account.findFirst({
      where: { id, userId },
    });
  }

  /**
   * Find account by name and user ID
   */
  async findByNameAndUserId(
    name: string,
    userId: string
  ): Promise<Account | null> {
    return prisma.account.findFirst({
      where: { name, userId },
    });
  }

  /**
   * Check if account name exists for user (excluding specific account)
   */
  async existsByNameAndUserId(
    name: string,
    userId: string,
    excludeId?: string
  ): Promise<boolean> {
    const where: any = { name, userId };
    
    if (excludeId) {
      where.id = { not: excludeId };
    }

    const count = await prisma.account.count({ where });
    return count > 0;
  }

  /**
   * Create new account
   */
  async create(data: {
    name: string;
    startingAmount: number;
    userId: string;
  }): Promise<Account> {
    return prisma.account.create({
      data,
    });
  }

  /**
   * Update account
   */
  async update(
    id: string,
    data: { name?: string; startingAmount?: number }
  ): Promise<Account> {
    return prisma.account.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete account
   */
  async delete(id: string): Promise<Account> {
    return prisma.account.delete({
      where: { id },
    });
  }

  /**
   * Get account with transactions
   */
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

  /**
   * Calculate current balance for an account
   */
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
      (sum, t) => sum + t.amount,
      0
    );

    return account.startingAmount + transactionsSum;
  }

  /**
   * Get accounts with balances
   */
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

    return accounts.map((account) => {
      const balance =
        account.startingAmount +
        account.transactions.reduce((sum, t) => sum + t.amount, 0);

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