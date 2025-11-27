import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *                 minLength: 6
   *               name:
   *                 type: string
   *     responses:
   *       201:
   *         description: User registered successfully
   *       400:
   *         description: Invalid input
   */
  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = registerSchema.parse(req.body);
      const result = await this.authService.register(data);
      res.status(201).json(result);
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
   * /api/auth/login:
   *   post:
   *     summary: Login user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login successful
   *       401:
   *         description: Invalid credentials
   */
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = loginSchema.parse(req.body);
      const result = await this.authService.login(data);
      res.json(result);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ error: 'Invalid input', details: error.errors });
      } else {
        res.status(401).json({ error: error.message });
      }
    }
  };
}