import { prisma } from './config/prisma';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Criando dados iniciais no banco de dados...');

  // 1. Lojista PRO Demo
  const passwordHashPro = await bcrypt.hash('123456', 10);
  const zeUser = await prisma.user.upsert({
    where: { email: 'lojista@pizzaria.com' },
    update: {
      plan: 'PRO',
      primaryColor: '#EA580C'
    },
    create: {
      name: 'Zé da Silva',
      email: 'lojista@pizzaria.com',
      passwordHash: passwordHashPro,
      storeName: 'Pizzaria do Zé',
      slug: 'pizzaria-do-ze',
      bio: 'As melhores pizzas artesanais da cidade! Entregas rápidas de terça a domingo.',
      avatarUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80',
      whatsappNumber: '5511999999999',
      plan: 'PRO',
      primaryColor: '#EA580C'
    }
  });

  // Limpa e recria links do Zé
  await prisma.link.deleteMany({ where: { userId: zeUser.id } });
  await prisma.link.createMany({
    data: [
      {
        userId: zeUser.id,
        title: '📱 Siga no Instagram',
        url: 'https://instagram.com/pizzariadoze',
        icon: 'instagram',
        order: 0
      },
      {
        userId: zeUser.id,
        title: '📄 Cardápio Completo em PDF',
        url: 'https://example.com/cardapio.pdf',
        icon: 'file-text',
        order: 1
      },
      {
        userId: zeUser.id,
        title: '📍 Nossa Localização no Google Maps',
        url: 'https://maps.google.com',
        icon: 'map-pin',
        order: 2
      }
    ]
  });

  // Limpa e recria produtos do Zé
  await prisma.product.deleteMany({ where: { userId: zeUser.id } });
  await prisma.product.createMany({
    data: [
      {
        userId: zeUser.id,
        name: 'Pizza Calabresa Especial (Grande)',
        description: 'Molho caseiro, mussarela, calabresa fatiada, cebola roxa e orégano.',
        price: 49.90,
        imageUrl: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=400&q=80',
        order: 0
      },
      {
        userId: zeUser.id,
        name: 'Pizza 4 Queijos (Grande)',
        description: 'Mussarela, provolone, gorgonzola e requeijão cremoso.',
        price: 54.90,
        imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=400&q=80',
        order: 1
      },
      {
        userId: zeUser.id,
        name: 'Guaraná Antarctica 2L',
        description: 'Refrigerante trincando de gelado!',
        price: 12.00,
        imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
        order: 2
      }
    ]
  });

  // 2. Lojista FREE Demo
  const passwordHashFree = await bcrypt.hash('123456', 10);
  const freeUser = await prisma.user.upsert({
    where: { email: 'contato@docesdamaria.com' },
    update: {
      plan: 'FREE',
      primaryColor: '#2563EB'
    },
    create: {
      name: 'Maria Santos',
      email: 'contato@docesdamaria.com',
      passwordHash: passwordHashFree,
      storeName: 'Doces da Maria',
      slug: 'doces-da-maria',
      bio: 'Bolos de aniversário, brigadeiros gourmet e docinhos para festas.',
      whatsappNumber: '5511888888888',
      plan: 'FREE',
      primaryColor: '#2563EB'
    }
  });

  await prisma.link.deleteMany({ where: { userId: freeUser.id } });
  await prisma.link.createMany({
    data: [
      {
        userId: freeUser.id,
        title: '📷 Instagram Doces da Maria',
        url: 'https://instagram.com/docesdamaria',
        icon: 'instagram',
        order: 0
      },
      {
        userId: freeUser.id,
        title: '💬 Solicitar Orçamento no WhatsApp',
        url: 'https://wa.me/5511888888888',
        icon: 'whatsapp',
        order: 1
      }
    ]
  });

  console.log('✅ Dados de demonstração criados com sucesso!');
  console.log('👤 Lojista PRO: lojista@pizzaria.com | Senha: 123456 (slug: pizzaria-do-ze)');
  console.log('👤 Lojista FREE: contato@docesdamaria.com | Senha: 123456 (slug: doces-da-maria)');
}

seed()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
