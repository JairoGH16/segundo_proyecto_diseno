import { PrismaClient } from '@prisma/client';

// Singleton pattern for Prisma Client
class DatabaseConnection {
  private static instance: PrismaClient;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new PrismaClient({
        log:
          process.env.NODE_ENV === 'development'
            ? ['query', 'error', 'warn']
            : ['error'],
        errorFormat: 'pretty',
      });

      // Handle connection errors
      DatabaseConnection.instance.$connect().catch((error: Error) => {
        console.error('Failed to connect to database:', error);
        process.exit(1);
      });

      // Graceful shutdown
      process.on('beforeExit', async () => {
        await DatabaseConnection.instance.$disconnect();
      });
    }

    return DatabaseConnection.instance;
  }

  public static async disconnect(): Promise<void> {
    if (DatabaseConnection.instance) {
      await DatabaseConnection.instance.$disconnect();
    }
  }

  public static async healthCheck(): Promise<boolean> {
    try {
      const prisma = DatabaseConnection.getInstance();
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const prisma = DatabaseConnection.getInstance();

// Export class for testing and special cases
export default DatabaseConnection;