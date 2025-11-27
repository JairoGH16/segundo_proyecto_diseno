import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateAccountData {
  name: string;
  startingAmount?: number;
  userId: string;
}

interface UpdateAccountData {
  name?: string;
  startingAmount?: number;
}

export class AccountService {
  async getAll(userId: string) {
    return prisma.account.findMany({
      where: { userId },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: string, userId: string) {
    return prisma.account.findFirst({
      where: { id, userId },
      include: {
        transactions: {
          orderBy: { date: 'desc' },
          take: 10,
        },
      },
    });
  }

  async create(data: CreateAccountData) {
    return prisma.account.create({
      data: {
        name: data.name,
        startingAmount: data.startingAmount || 0,
        userId: data.userId,
      },
    });
  }

  async update(id: string, userId: string, data: UpdateAccountData) {
    const account = await prisma.account.findFirst({
      where: { id, userId },
    });

    if (!account) {
      throw new Error('Account not found');
    }

    return prisma.account.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, userId: string) {
    const account = await prisma.account.findFirst({
      where: { id, userId },
    });

    if (!account) {
      throw new Error('Account not found');
    }

    return prisma.account.delete({
      where: { id },
    });
  }
}