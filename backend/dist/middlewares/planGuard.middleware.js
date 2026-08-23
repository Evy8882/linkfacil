"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLinkLimit = exports.requireProPlan = void 0;
const prisma_1 = require("../config/prisma");
/**
 * Trava que exige Plano PRO para acessar a rota (Catálogo de Produtos)
 */
const requireProPlan = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Não autenticado.' });
    }
    // Buscar status atualizado do usuário no BD para garantir valor em tempo real
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: req.user.id },
        select: { plan: true }
    });
    if (!user || user.plan !== 'PRO') {
        return res.status(403).json({
            error: 'Recurso bloqueado.',
            message: 'O catálogo de produtos e recursos avançados são exclusivos do Plano PRO.',
            code: 'PLAN_PRO_REQUIRED'
        });
    }
    next();
};
exports.requireProPlan = requireProPlan;
/**
 * Trava que valida o limite de 3 links no Plano Gratuito
 */
const validateLinkLimit = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Não autenticado.' });
    }
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: req.user.id },
        select: { plan: true }
    });
    if (user && user.plan === 'FREE') {
        const linkCount = await prisma_1.prisma.link.count({
            where: { userId: req.user.id }
        });
        if (linkCount >= 3) {
            return res.status(403).json({
                error: 'Limite de links atingido.',
                message: 'No plano Gratuito você pode cadastrar até 3 links. Faça o upgrade para o Plano PRO para criar links ilimitados e cadastrar catálogo de produtos!',
                code: 'LINK_LIMIT_REACHED'
            });
        }
    }
    next();
};
exports.validateLinkLimit = validateLinkLimit;
