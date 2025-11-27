import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { TransactionService } from '../services/transaction.service';
import { z } from 'zod';

const createTransactionSchema = z.object({
  description: z.string().min(1),
  amount: z.number(),
  date: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  tags: z.array(z.string()).default([]),
  accountId: z.string().uuid(),
  isRecurring: z.boolean().default(false),
  frequency: z.string().optional(),
  endDate: z.string().datetime().optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()),
});

const updateTransactionSchema = createTransactionSchema.partial();

export class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  /**
   * @swagger
   * /api/transactions:
   *   get:
   *     summary: Get all transactions with filters
   *     tags: [Transactions]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: accountId
   *         schema:
   *           type: string
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date
   *       - in: query
   *         name: tags
   *         schema:
   *           type: string
   *         description: Comma-separated tags
   *     responses:
   *       200:
   *         description: List of transactions
   */
  getAll = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const filters = {
        accountId: req.query.accountId as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
      };

      const transactions = await this.transactionService.getAll(
        req.userId!,
        filters
      );
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  /**
   * @swagger
   * /api/transactions:
   *   post:
   *     summary: Create new transaction
   *     tags: [Transactions]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - description
   *               - amount
   *               - date
   *               - accountId
   *             properties:
   *               description:
   *                 type: string
   *               amount:
   *                 type: number
   *               date:
   *                 type: string
   *                 format: date
   *               tags:
   *                 type: array
   *                 items:
   *                   type: string
   *               accountId:
   *                 type: string
   *               isRecurring:
   *                 type: boolean
   *               frequency:
   *                 type: string
   *               endDate:
   *                 type: string
   *                 format: date
   *     responses:
   *       201:
   *         description: Transaction created
   */
  create = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const data = createTransactionSchema.parse(req.body);
      const transaction = await this.transactionService.create(
        req.userId!,
        data
      );
      res.status(201).json(transaction);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ error: 'Invalid input', details: error.errors });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  };

  /**
   * @swagger
   * /api/transactions/{id}:
   *   put:
   *     summary: Update transaction
   *     tags: [Transactions]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               description:
   *                 type: string
   *               amount:
   *                 type: number
   *               date:
   *                 type: string
   *               tags:
   *                 type: array
   *                 items:
   *                   type: string
   *     responses:
   *       200:
   *         description: Transaction updated
   */
  update = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const data = updateTransactionSchema.parse(req.body);
      const transaction = await this.transactionService.update(
        req.params.id,
        req.userId!,
        data
      );
      res.json(transaction);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ error: 'Invalid input', details: error.errors });
      } else {
        res.status(404).json({ error: error.message });
      }
    }
  };

  /**
   * @swagger
   * /api/transactions/{id}:
   *   delete:
   *     summary: Delete transaction
   *     tags: [Transactions]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: Transaction deleted
   */
  delete = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      await this.transactionService.delete(req.params.id, req.userId!);
      res.status(204).send();
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };
}