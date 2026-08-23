import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { prisma } from './config/prisma';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// API base path
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'LinkFácil Backend API' });
});

async function main() {
  try {
    await prisma.$connect();
    console.log('✅ Conectado ao banco de dados SQLite com Prisma!');
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Erro ao inicializar o servidor:', err);
    process.exit(1);
  }
}

main();
