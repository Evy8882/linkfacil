"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderLinks = exports.deleteLink = exports.updateLink = exports.createLink = exports.getLinks = void 0;
const prisma_1 = require("../config/prisma");
const getLinks = async (req, res) => {
    try {
        const links = await prisma_1.prisma.link.findMany({
            where: { userId: req.user.id },
            orderBy: { order: 'asc' }
        });
        return res.json({ links });
    }
    catch (err) {
        console.error('Erro ao listar links:', err);
        return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
};
exports.getLinks = getLinks;
const createLink = async (req, res) => {
    try {
        const { title, url, icon } = req.body;
        if (!title || !url) {
            return res.status(400).json({ error: 'Título e URL são obrigatórios.' });
        }
        const currentCount = await prisma_1.prisma.link.count({
            where: { userId: req.user.id }
        });
        const link = await prisma_1.prisma.link.create({
            data: {
                userId: req.user.id,
                title,
                url,
                icon: icon || 'globe',
                order: currentCount
            }
        });
        return res.status(201).json({ message: 'Link adicionado com sucesso!', link });
    }
    catch (err) {
        console.error('Erro ao criar link:', err);
        return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
};
exports.createLink = createLink;
const updateLink = async (req, res) => {
    try {
        const id = req.params.id;
        const { title, url, icon, isActive } = req.body;
        const existingLink = await prisma_1.prisma.link.findFirst({
            where: { id, userId: req.user.id }
        });
        if (!existingLink) {
            return res.status(404).json({ error: 'Link não encontrado ou não pertence a este usuário.' });
        }
        const link = await prisma_1.prisma.link.update({
            where: { id },
            data: {
                ...(title ? { title } : {}),
                ...(url ? { url } : {}),
                ...(icon ? { icon } : {}),
                ...(isActive !== undefined ? { isActive } : {})
            }
        });
        return res.json({ message: 'Link atualizado com sucesso!', link });
    }
    catch (err) {
        console.error('Erro ao atualizar link:', err);
        return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
};
exports.updateLink = updateLink;
const deleteLink = async (req, res) => {
    try {
        const id = req.params.id;
        const existingLink = await prisma_1.prisma.link.findFirst({
            where: { id, userId: req.user.id }
        });
        if (!existingLink) {
            return res.status(404).json({ error: 'Link não encontrado ou não pertence a este usuário.' });
        }
        await prisma_1.prisma.link.delete({ where: { id } });
        return res.json({ message: 'Link removido com sucesso!' });
    }
    catch (err) {
        console.error('Erro ao deletar link:', err);
        return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
};
exports.deleteLink = deleteLink;
const reorderLinks = async (req, res) => {
    try {
        const { orderedIds } = req.body;
        if (!Array.isArray(orderedIds)) {
            return res.status(400).json({ error: 'Payload de reordenação inválido.' });
        }
        // Atualiza a ordem de cada link em transação
        await prisma_1.prisma.$transaction(orderedIds.map((id, index) => prisma_1.prisma.link.updateMany({
            where: { id, userId: req.user.id },
            data: { order: index }
        })));
        return res.json({ message: 'Links reordenados com sucesso!' });
    }
    catch (err) {
        console.error('Erro ao reordenar links:', err);
        return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
};
exports.reorderLinks = reorderLinks;
