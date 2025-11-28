import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { AccountService } from '../services/account.service';
import { z } from 'zod';

const createAccountSchema = z.object({
  name: z.string().min(1).max(100),
  startingAmount: z.number().default(0),
});

const updateAccountSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  startingAmount: z.number().optional(),
});

export class AccountController {
  private accountService: AccountService;

  constructor() {
    this.accountService = new AccountService();
  }

  /**
   * @swagger
   * /api/accounts:
   *   get:
   *     summary: Get all accounts for authenticated user
   *     tags: [Accounts]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of accounts
   */
  getAll = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const accounts = await this.accountService.getAll(req.userId!);
      res.json(accounts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  /**
   * @swagger
   * /api/accounts/{id}:
   *   get:
   *     summary: Get account by ID
   *     tags: [Accounts]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Account details
   *       404:
   *         description: Account not found
   */
  getById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const account = await this.accountService.getById(
        req.params.id,
        req.userId!
      );
      if (!account) {
        res.status(404).json({ error: 'Account not found' });
        return;
      }
      res.json(account);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  /**
   * @swagger
   * /api/accounts:
   *   post:
   *     summary: Create new account
   *     tags: [Accounts]
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
   *             properties:
   *               name:
   *                 type: string
   *                 maxLength: 100
   *               startingAmount:
   *                 type: number
   *                 default: 0
   *     responses:
   *       201:
   *         description: Account created
   *       409:
   *         description: Account name already exists for this user
   */
  create = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const data = createAccountSchema.parse(req.body);
      const account = await this.accountService.create({
        ...data,
        userId: req.userId!,
      });
      res.status(201).json(account);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ 
          error: 'Invalid input', 
          details: error.errors 
        });
      } else if (error.message.includes('already have an account')) {
        res.status(409).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  };

  /**
   * @swagger
   * /api/accounts/{id}:
   *   put:
   *     summary: Update account
   *     tags: [Accounts]
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
   *               name:
   *                 type: string
   *                 maxLength: 100
   *               startingAmount:
   *                 type: number
   *     responses:
   *       200:
   *         description: Account updated
   *       409:
   *         description: Account name already exists for this user
   */
  update = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const data = updateAccountSchema.parse(req.body);
      const account = await this.accountService.update(
        req.params.id,
        req.userId!,
        data
      );
      res.json(account);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ 
          error: 'Invalid input', 
          details: error.errors 
        });
      } else if (error.message.includes('already have an account')) {
        res.status(409).json({ error: error.message });
      } else if (error.message === 'Account not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  };

  /**
   * @swagger
   * /api/accounts/{id}:
   *   delete:
   *     summary: Delete account
   *     tags: [Accounts]
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
   *         description: Account deleted
   */
  delete = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      await this.accountService.delete(req.params.id, req.userId!);
      res.status(204).send();
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };
}