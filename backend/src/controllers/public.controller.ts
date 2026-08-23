import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const getPublicStore = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;

    const user = await prisma.user.findUnique({
      where: { slug: slug.toLowerCase() },
      select: {
        id: true,
        storeName: true,
        slug: true,
        bio: true,
        avatarUrl: true,
        whatsappNumber: true,
        primaryColor: true,
        plan: true,
        links: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            url: true,
            icon: true,
            order: true
          }
        },
        products: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            imageUrl: true,
            customMessage: true,
            order: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Negócio não encontrado.' });
    }

    const isPro = user.plan === 'PRO';

    return res.json({
      store: {
        storeName: user.storeName,
        slug: user.slug,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        whatsappNumber: user.whatsappNumber,
        primaryColor: isPro ? user.primaryColor : '#2563EB', // Força cor padrão se FREE
        plan: user.plan,
        links: user.links,
        products: isPro ? user.products : [] // Oculta produtos se FREE
      }
    });
  } catch (err) {
    console.error('Erro ao buscar loja pública:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};
