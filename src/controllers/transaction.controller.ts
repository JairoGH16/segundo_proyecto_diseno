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
  endDate: z
    .string()
    .datetime()
    .optional()
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()),
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
   *     description: Returns a list of transactions for the authenticated user with optional filters
   *     tags: [Transactions]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: accountId
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Filter by account ID
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date
   *         description: Filter transactions from this date
   *         example: "2025-01-01"
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date
   *         description: Filter transactions until this date
   *         example: "2025-12-31"
   *       - in: query
   *         name: tags
   *         schema:
   *           type: string
   *         description: Filter by tags (comma-separated)
   *         example: "food,groceries"
   *     responses:
   *       200:
   *         description: List of transactions retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Transaction'
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
      const filters = {
        accountId: req.query.accountId as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        tags: req.query.tags
          ? (req.query.tags as string).split(',')
          : undefined,
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
   *     description: Create a new transaction (income or expense) for a specific account
   *     tags: [Transactions]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateTransaction'
   *     responses:
   *       201:
   *         description: Transaction created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Transaction'
   *       400:
   *         description: Invalid input or account not found
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
   *     description: Update an existing transaction's information
   *     tags: [Transactions]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Transaction UUID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               description:
   *                 type: string
   *                 example: "Updated description"
   *               amount:
   *                 type: number
   *                 example: -75.50
   *               date:
   *                 type: string
   *                 format: date
   *                 example: "2025-11-28"
   *               tags:
   *                 type: array
   *                 items:
   *                   type: string
   *                 example: ["shopping", "clothes"]
   *     responses:
   *       200:
   *         description: Transaction updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Transaction'
   *       400:
   *         description: Invalid input
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Transaction not found
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
   *     description: Delete a transaction permanently
   *     tags: [Transactions]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Transaction UUID
   *     responses:
   *       204:
   *         description: Transaction deleted successfully
   *       404:
   *         description: Transaction not found
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
  delete = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      await this.transactionService.delete(req.params.id, req.userId!);
      res.status(204).send();
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };
}