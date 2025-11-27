import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createDebtSchema = z.object({
  name: z.string().min(1),
  lender: z.string().min(1),
  principal: z.number().positive(),
  interestRate: z.number().default(0),
  startDate: z.string().datetime().optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()),
  dueDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
});

export class DebtController {
  /**
   * @swagger
   * /api/debts:
   *   get:
   *     summary: Get all debts
   *     tags: [Debts]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of debts with payments
   */
  getAll = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const debts = await prisma.debt.findMany({
        where: { userId: req.userId },
        include: { payments: true },
      });
      res.json(debts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  /**
   * @swagger
   * /api/debts:
   *   post:
   *     summary: Create new debt
   *     tags: [Debts]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - lender
   *               - principal
   *               - dueDate
   *             properties:
   *               name:
   *                 type: string
   *               lender:
   *                 type: string
   *               principal:
   *                 type: number
   *               interestRate:
   *                 type: number
   *               startDate:
   *                 type: string
   *               dueDate:
   *                 type: string
   *     responses:
   *       201:
   *         description: Debt created
   */
  create = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const data = createDebtSchema.parse(req.body);
      const debt = await prisma.debt.create({
        data: {
          ...data,
          startDate: data.startDate ? new Date(data.startDate) : null,
          dueDate: new Date(data.dueDate),
          userId: req.userId!,
        },
      });
      res.status(201).json(debt);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ error: 'Invalid input', details: error.errors });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  };
}