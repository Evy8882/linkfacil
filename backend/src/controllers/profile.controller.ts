import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { prisma } from '../config/prisma';

export const getProfile = async (req: AuthRequest, res: Response) => {
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
        plan: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    return res.json({ user });
  } catch (err) {
    console.error('Erro ao buscar perfil:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { storeName, bio, avatarUrl, whatsappNumber, primaryColor } = req.body;

    const currentUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!currentUser) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Trava de alteração de cor no Plano FREE
    if (primaryColor && primaryColor !== currentUser.primaryColor && currentUser.plan === 'FREE') {
      return res.status(403).json({
        error: 'Recurso bloqueado.',
        message: 'A personalização das cores da página é um recurso exclusivo do Plano PRO. Faça o upgrade para desbloquear!',
        code: 'COLOR_CUSTOMIZATION_LOCKED'
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(storeName !== undefined ? { storeName } : {}),
        ...(bio !== undefined ? { bio } : {}),
        ...(avatarUrl !== undefined ? { avatarUrl } : {}),
        ...(whatsappNumber !== undefined ? { whatsappNumber } : {}),
        ...(primaryColor && currentUser.plan === 'PRO' ? { primaryColor } : {})
      },
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
        plan: true
      }
    });

    return res.json({ message: 'Perfil atualizado com sucesso!', user: updatedUser });
  } catch (err) {
    console.error('Erro ao atualizar perfil:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};
