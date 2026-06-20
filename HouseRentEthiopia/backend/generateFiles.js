const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const dirs = [
  'src/config',
  'src/controllers',
  'src/middlewares',
  'src/routes',
  'src/services',
  'src/utils'
];

dirs.forEach(dir => {
  fs.mkdirSync(path.join(baseDir, dir), { recursive: true });
});

const files = {
  'src/utils/jwt.ts': `import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
};
export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};`,

  'src/middlewares/auth.middleware.ts': `import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export interface AuthRequest extends Request { user?: any; }

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });
  try {
    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(401).json({ success: false, message: 'User no longer exists' });
    req.user = user;
    next();
  } catch (error) { res.status(401).json({ success: false, message: 'Not authorized, token failed' }); }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ success: false, message: 'User role not authorized' });
    next();
  };
};`,

  'src/controllers/auth.controller.ts': `import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, phoneNumber } = req.body;
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) return res.status(400).json({ success: false, message: 'User already exists' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await prisma.user.create({ data: { name, email, password: hashedPassword, role: role || 'RENTER', phoneNumber } });
    const token = generateToken(user.id, user.role);
    res.status(201).json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = generateToken(user.id, user.role);
    res.status(200).json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};

export const logout = (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};`,

  'src/routes/auth.routes.ts': `import { Router } from 'express';
import { register, login, logout } from '../controllers/auth.controller';
const router = Router();
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
export default router;`,

  'src/app.ts': `import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('House Rent Ethiopia API is running!');
});

export default app;`,

  'src/server.ts': `import app from './app';
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));`

};

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, filepath), content);
}
console.log("Backend files generated successfully.");
