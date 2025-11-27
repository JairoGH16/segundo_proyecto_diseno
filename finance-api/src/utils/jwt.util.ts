import jwt from 'jsonwebtoken';

interface JWTPayload {
  userId: string;
}

export class JWTUtil {
  static generate(userId: string): string {
    const secret = process.env.JWT_SECRET || 'default-secret';
    
    return jwt.sign(
      { userId },
      secret,
      { expiresIn: '7d' }
    );
  }

  static verify(token: string): JWTPayload {
    const secret = process.env.JWT_SECRET || 'default-secret';
    
    try {
      return jwt.verify(token, secret) as JWTPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  static decode(token: string): JWTPayload | null {
    try {
      return jwt.decode(token) as JWTPayload;
    } catch (error) {
      return null;
    }
  }
}