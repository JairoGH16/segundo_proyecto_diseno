import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createBudgetSchema = z.object({
  name: z.string().min(1),
  limit: z.number().positive(),
  tag: z.string().min(1),
  startDate: z.string().datetime().optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()),
  endDate: z.string().datetime().optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()),
});

export class BudgetController {
  /**
   * @swagger
   * /api/budgets:
   *   get:
   *     summary: Get all budgets
   *     tags: [Budgets]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of budgets
   */
  getAll = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const budgets = await prisma.budget.findMany({
        where: { userId: req.userId },
      });
      res.json(budgets);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  /**
   * @swagger
   * /api/budgets:
   *   post:
   *     summary: Create new budget
   *     tags: [Budgets]
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
   *               - limit
   *               - tag
   *             properties:
   *               name:
   *                 type: string
   *               limit:
   *                 type: number
   *               tag:
   *                 type: string
   *               startDate:
   *                 type: string
   *               endDate:
   *                 type: string
   *     responses:
   *       201:
   *         description: Budget created
   */
  create = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const data = createBudgetSchema.parse(req.body);
      const budget = await prisma.budget.create({
        data: {
          ...data,
          startDate: data.startDate ? new Date(data.startDate) : null,
          endDate: data.endDate ? new Date(data.endDate) : null,
          userId: req.userId!,
        },
      });
      res.status(201).json(budget);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ error: 'Invalid input', details: error.errors });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  };
}