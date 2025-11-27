import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRepository {
  /**
   * Find user by email
   */
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Find user by ID
   */
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Create new user
   */
  async create(data: {
    email: string;
    password: string;
    name?: string;
  }) {
    return prisma.user.create({
      data,
    });
  }

  /**
   * Update user
   */
  async update(
    id: string,
    data: { email?: string; password?: string; name?: string }
  ) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete user
   */
  async delete(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: { email },
    });
    return count > 0;
  }

  /**
   * Get user with all related data
   */
  async findByIdWithRelations(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        accounts: true,
        budgets: true,
        debts: {
          include: {
            payments: true,
          },
        },
        guarantees: true,
      },
    });
  }
}