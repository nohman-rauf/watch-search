import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { supabase } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthRequest extends Request {
  userId?: string;
}

export async function createAdmin(email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('admins')
    .insert({
      email,
      password_hash: hashedPassword
    })
    .select()
    .single();

  return { data, error };
}

export async function loginAdmin(email: string, password: string) {
  const { data: admin } = await supabase
    .from('admins')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (!admin) {
    return { token: null, error: 'Invalid credentials' };
  }

  const isValid = await bcrypt.compare(password, admin.password_hash);

  if (!isValid) {
    return { token: null, error: 'Invalid credentials' };
  }

  const token = jwt.sign({ userId: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: '7d' });

  return { token, error: null };
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}
