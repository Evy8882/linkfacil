import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

const JWT_SECRET = process.env.JWT_SECRET || 'linkfacil-secret-key-2026';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, storeName, slug, whatsappNumber } = req.body;

    if (!name || !email || !password || !storeName || !slug) {
      return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
    }

    const normalizedSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { slug: normalizedSlug }]
      }
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
      }
      return res.status(400).json({ error: 'Este slug (URL) já está em uso por outro negócio.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        storeName,
        slug: normalizedSlug,
        whatsappNumber: whatsappNumber || '5511999999999',
        plan: 'FREE'
      }
    });

    const token = jwt.sign({ id: user.id, email: user.email, plan: user.plan }, JWT_SECRET, {
      expiresIn: '7d'
    });

    return res.status(201).json({
      message: 'Conta criada com sucesso!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        storeName: user.storeName,
        slug: user.slug,
        plan: user.plan
      }
    });
  } catch (err) {
    console.error('Erro no registro:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Informe e-mail e senha.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: 'Credenciais inválidas.' });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      return res.status(400).json({ error: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, plan: user.plan }, JWT_SECRET, {
      expiresIn: '7d'
    });

    return res.json({
      message: 'Login realizado com sucesso!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        storeName: user.storeName,
        slug: user.slug,
        plan: user.plan,
        primaryColor: user.primaryColor
      }
    });
  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        name: true,
        email: true,
        storeName: true,
        slug: true,
        bio: true,
        avatarUrl: true,
        whatsappNumber: true,
        primaryColor: true,
        plan: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    return res.json({ user });
  } catch (err) {
    console.error('Erro ao buscar dados do usuário:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};
