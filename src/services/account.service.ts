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
    // Validar que no exista otra cuenta con el mismo nombre para este usuario
    const existingAccount = await prisma.account.findFirst({
      where: {
        userId: data.userId,
        name: data.name,
      },
    });

    if (existingAccount) {
      throw new Error(
        `You already have an account named "${data.name}". Please choose a different name.`
      );
    }

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

    // Si se está actualizando el nombre, verificar que no exista otra cuenta con ese nombre
    if (data.name && data.name !== account.name) {
      const existingAccount = await prisma.account.findFirst({
        where: {
          userId: userId,
          name: data.name,
          id: { not: id }, // Excluir la cuenta actual
        },
      });

      if (existingAccount) {
        throw new Error(
          `You already have an account named "${data.name}". Please choose a different name.`
        );
      }
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