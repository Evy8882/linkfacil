"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const prisma_1 = require("./config/prisma");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// API base path
app.use('/api', routes_1.default);
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'LinkFácil Backend API' });
});
async function main() {
    try {
        await prisma_1.prisma.$connect();
        console.log('✅ Conectado ao banco de dados SQLite com Prisma!');
        app.listen(PORT, () => {
            console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
        });
    }
    catch (err) {
        console.error('❌ Erro ao inicializar o servidor:', err);
        process.exit(1);
    }
}
main();
