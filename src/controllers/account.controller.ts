import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { AccountService } from '../services/account.service';
import { z } from 'zod';

const createAccountSchema = z.object({
  name: z.string().min(1),
  startingAmount: z.number().default(0),
});

const updateAccountSchema = z.object({
  name: z.string().min(1).optional(),
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
   *     description: Returns a list of all accounts belonging to the authenticated user
   *     tags: [Accounts]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of accounts retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Account'
   *       401:
   *         description: Unauthorized - Invalid or missing token
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
   *     description: Returns a single account with its details and recent transactions
   *     tags: [Accounts]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Account UUID
   *     responses:
   *       200:
   *         description: Account details retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Account'
   *       404:
   *         description: Account not found
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
   *     description: Create a new bank account for the authenticated user
   *     tags: [Accounts]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateAccount'
   *     responses:
   *       201:
   *         description: Account created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Account'
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
      const data = createAccountSchema.parse(req.body);
      const account = await this.accountService.create({
        ...data,
        userId: req.userId!,
      });
      res.status(201).json(account);
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
   * /api/accounts/{id}:
   *   put:
   *     summary: Update account
   *     description: Update an existing account's information
   *     tags: [Accounts]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Account UUID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateAccount'
   *     responses:
   *       200:
   *         description: Account updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Account'
   *       400:
   *         description: Invalid input
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Account not found
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
      const data = updateAccountSchema.parse(req.body);
      const account = await this.accountService.update(
        req.params.id,
        req.userId!,
        data
      );
      res.json(account);
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
   * /api/accounts/{id}:
   *   delete:
   *     summary: Delete account
   *     description: Delete an account and all its associated transactions
   *     tags: [Accounts]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Account UUID
   *     responses:
   *       204:
   *         description: Account deleted successfully
   *       404:
   *         description: Account not found
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
      await this.accountService.delete(req.params.id, req.userId!);
      res.status(204).send();
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };
}