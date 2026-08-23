"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProducts = void 0;
const prisma_1 = require("../config/prisma");
const getProducts = async (req, res) => {
    try {
        const products = await prisma_1.prisma.product.findMany({
            where: { userId: req.user.id },
            orderBy: { order: 'asc' }
        });
        return res.json({ products });
    }
    catch (err) {
        console.error('Erro ao listar produtos:', err);
        return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
};
exports.getProducts = getProducts;
const createProduct = async (req, res) => {
    try {
        const { name, description, price, imageUrl, customMessage } = req.body;
        if (!name || price === undefined) {
            return res.status(400).json({ error: 'Nome e preço do produto são obrigatórios.' });
        }
        const currentCount = await prisma_1.prisma.product.count({
            where: { userId: req.user.id }
        });
        const product = await prisma_1.prisma.product.create({
            data: {
                userId: req.user.id,
                name,
                description: description || '',
                price: parseFloat(price),
                imageUrl: imageUrl || '',
                customMessage: customMessage || null,
                order: currentCount
            }
        });
        return res.status(201).json({ message: 'Produto cadastrado no catálogo com sucesso!', product });
    }
    catch (err) {
        console.error('Erro ao criar produto:', err);
        return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, description, price, imageUrl, customMessage, isActive } = req.body;
        const existingProduct = await prisma_1.prisma.product.findFirst({
            where: { id, userId: req.user.id }
        });
        if (!existingProduct) {
            return res.status(404).json({ error: 'Produto não encontrado ou não pertence a este lojista.' });
        }
        const product = await prisma_1.prisma.product.update({
            where: { id },
            data: {
                ...(name ? { name } : {}),
                ...(description !== undefined ? { description } : {}),
                ...(price !== undefined ? { price: parseFloat(price) } : {}),
                ...(imageUrl !== undefined ? { imageUrl } : {}),
                ...(customMessage !== undefined ? { customMessage } : {}),
                ...(isActive !== undefined ? { isActive } : {})
            }
        });
        return res.json({ message: 'Produto atualizado com sucesso!', product });
    }
    catch (err) {
        console.error('Erro ao atualizar produto:', err);
        return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const existingProduct = await prisma_1.prisma.product.findFirst({
            where: { id, userId: req.user.id }
        });
        if (!existingProduct) {
            return res.status(404).json({ error: 'Produto não encontrado ou não pertence a este lojista.' });
        }
        await prisma_1.prisma.product.delete({ where: { id } });
        return res.json({ message: 'Produto removido do catálogo!' });
    }
    catch (err) {
        console.error('Erro ao deletar produto:', err);
        return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
};
exports.deleteProduct = deleteProduct;
