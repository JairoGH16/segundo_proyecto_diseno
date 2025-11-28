import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createGuaranteeSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  amount: z.number().min(0),
  expiryDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
});

export class GuaranteeController {
  /**
   * @swagger
   * /api/guarantees:
   *   get:
   *     summary: Get all guarantees
   *     description: Returns a list of all product guarantees/warranties for the authenticated user
   *     tags: [Guarantees]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of guarantees retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Guarantee'
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
      const guarantees = await prisma.guarantee.findMany({
        where: { userId: req.userId },
        orderBy: { expiryDate: 'asc' },
      });
      res.json(guarantees);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  /**
   * @swagger
   * /api/guarantees:
   *   post:
   *     summary: Create new guarantee
   *     description: Create a new product guarantee/warranty record. Use amount = 0 for included warranties
   *     tags: [Guarantees]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateGuarantee'
   *     responses:
   *       201:
   *         description: Guarantee created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Guarantee'
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
      const data = createGuaranteeSchema.parse(req.body);
      const guarantee = await prisma.guarantee.create({
        data: {
          ...data,
          expiryDate: new Date(data.expiryDate),
          userId: req.userId!,
        },
      });
      res.status(201).json(guarantee);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ error: 'Invalid input', details: error.errors });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  };
}