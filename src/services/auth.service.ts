import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  async register(data: RegisterData) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    const token = this.generateToken(user.id);

    return { user, token };
  }

  async login(data: LoginData) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  }

  private generateToken(userId: string): string {
    const secret = process.env.JWT_SECRET || 'default-secret';
    
    return jwt.sign(
      { userId },
      secret,
      { expiresIn: '7d' }
    );
  }
}