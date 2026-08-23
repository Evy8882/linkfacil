import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { prisma } from '../config/prisma';

export const getLinks = async (req: AuthRequest, res: Response) => {
  try {
    const links = await prisma.link.findMany({
      where: { userId: req.user!.id },
      orderBy: { order: 'asc' }
    });

    return res.json({ links });
  } catch (err) {
    console.error('Erro ao listar links:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

export const createLink = async (req: AuthRequest, res: Response) => {
  try {
    const { title, url, icon } = req.body;

    if (!title || !url) {
      return res.status(400).json({ error: 'Título e URL são obrigatórios.' });
    }

    const currentCount = await prisma.link.count({
      where: { userId: req.user!.id }
    });

    const link = await prisma.link.create({
      data: {
        userId: req.user!.id,
        title,
        url,
        icon: icon || 'globe',
        order: currentCount
      }
    });

    return res.status(201).json({ message: 'Link adicionado com sucesso!', link });
  } catch (err) {
    console.error('Erro ao criar link:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

export const updateLink = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { title, url, icon, isActive } = req.body;

    const existingLink = await prisma.link.findFirst({
      where: { id, userId: req.user!.id }
    });

    if (!existingLink) {
      return res.status(404).json({ error: 'Link não encontrado ou não pertence a este usuário.' });
    }

    const link = await prisma.link.update({
      where: { id },
      data: {
        ...(title ? { title } : {}),
        ...(url ? { url } : {}),
        ...(icon ? { icon } : {}),
        ...(isActive !== undefined ? { isActive } : {})
      }
    });

    return res.json({ message: 'Link atualizado com sucesso!', link });
  } catch (err) {
    console.error('Erro ao atualizar link:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

export const deleteLink = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    const existingLink = await prisma.link.findFirst({
      where: { id, userId: req.user!.id }
    });

    if (!existingLink) {
      return res.status(404).json({ error: 'Link não encontrado ou não pertence a este usuário.' });
    }

    await prisma.link.delete({ where: { id } });

    return res.json({ message: 'Link removido com sucesso!' });
  } catch (err) {
    console.error('Erro ao deletar link:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

export const reorderLinks = async (req: AuthRequest, res: Response) => {
  try {
    const { orderedIds } = req.body as { orderedIds: string[] };

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: 'Payload de reordenação inválido.' });
    }

    // Atualiza a ordem de cada link em transação
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.link.updateMany({
          where: { id, userId: req.user!.id },
          data: { order: index }
        })
      )
    );

    return res.json({ message: 'Links reordenados com sucesso!' });
  } catch (err) {
    console.error('Erro ao reordenar links:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};
