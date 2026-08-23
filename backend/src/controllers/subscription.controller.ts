import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { prisma } from '../config/prisma';

export const simulatePaymentToggle = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const newPlan = user.plan === 'PRO' ? 'FREE' : 'PRO';

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { plan: newPlan },
      select: {
        id: true,
        name: true,
        email: true,
        storeName: true,
        slug: true,
        plan: true,
        primaryColor: true
      }
    });

    const message = newPlan === 'PRO' 
      ? 'Pagamento PRO simulado com sucesso! Todas as travas foram removidas instantaneamente.' 
      : 'Plano alterado para Gratuito.';

    return res.json({ message, user: updatedUser });
  } catch (err) {
    console.error('Erro na simulação de pagamento:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};
