import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createBudgetSchema = z.object({
  name: z.string().min(1),
  limit: z.number().min(0),
  tag: z.string().min(1),
  startDate: z
    .string()
    .datetime()
    .optional()
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()),
  endDate: z
    .string()
    .datetime()
    .optional()
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()),
});

export class BudgetController {
  /**
   * @swagger
   * /api/budgets:
   *   get:
   *     summary: Get all budgets
   *     description: Returns a list of all budgets for the authenticated user
   *     tags: [Budgets]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of budgets retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Budget'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  getAll = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const budgets = await prisma.budget.findMany({
        where: { userId: req.userId },
        orderBy: { createdAt: 'desc' },
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
   *     description: Create a new budget to track expenses by tag
   *     tags: [Budgets]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateBudget'
   *     responses:
   *       201:
   *         description: Budget created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Budget'
   *       400:
   *         description: Invalid input
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
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