# 🚀 LinkFácil - Centralizador de Links & Catálogo no WhatsApp

> 📌 **Nota Acadêmica**: Este projeto é uma **simulação de software SaaS (Software as a Service)** desenvolvida exclusivamente como atividade prática para o **Curso Técnico em Desenvolvimento de Sistemas**. Não possui cobranças reais nem integrações com gateways de pagamento de produção.

---

## 📖 Sobre o Projeto

O **LinkFácil** é uma plataforma desenvolvida para microempreendedores e pequenos negócios criarem uma página única no formato `linkfacil.com/[slug]`. A solução permite organizar links de contato e exibir um **mini-catálogo de produtos** com botão de pedido direto no WhatsApp (`https://wa.me/...`).

---

## ⚡ Principais Funcionalidades

- 🔗 **Gerenciador de Links**: Cadastro, edição e remoção de links úteis (redes sociais, localização, PDF, site).
- 🛍️ **Catálogo de Produtos no WhatsApp**: Vitrine virtual com foto, nome, preço, descrição e botão que abre a conversa no WhatsApp com o pedido formatado.
- 🎨 **Personalização de Identidade Visual**: Escolha da cor primária da página pública (presets e seletor de cores customizado).
- 💳 **Simulação de Checkout PRO**: Botão na aba de assinatura que alterna o status da conta entre `GRATUITO` e `PRO` no banco de dados sem passar por gateway de pagamento.
- 🌐 **Página Pública (`/[slug]`)**: Visualização otimizada para dispositivos móveis com metadados HTML, favicon e carregamento dinâmico.

---

## 🛡️ Regras de Negócio & Trava de Planos

| Funcionalidade | Plano Gratuito | Plano PRO |
| :--- | :---: | :---: |
| **Limite de Links** | Até 3 links simples | **Ilimitado** |
| **Catálogo de Produtos** | ❌ Bloqueado | **✅ Liberado** |
| **Personalização de Cores** | ❌ Apenas azul padrão (`#2563EB`) | **✅ Qualquer cor (Presets / Color Picker)** |
| **Checkout** | — | **Simulação instantânea (1-clique)** |

---

## 🛠️ Tecnologias Utilizadas

### **Front-end**
* **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
* **Biblioteca UI**: [React 19](https://react.dev/)
* **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
* **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
* **Ícones**: [Lucide React](https://lucide.dev/)

### **Back-end**
* **Ambiente**: [Node.js](https://nodejs.org/)
* **Framework Web**: [Express.js](https://expressjs.com/)
* **ORM**: [Prisma ORM](https://www.prisma.io/)
* **Banco de Dados**: SQLite (`dev.db`)
* **Autenticação**: JSON Web Token (JWT) & `bcryptjs`

---

## 📂 Estrutura do Repositório

```text
linkfacil/
├── backend/
│   ├── prisma/
│   │   ├── dev.db              # Banco de dados SQLite
│   │   └── schema.prisma       # Modelagem relacional do Prisma
│   ├── src/
│   │   ├── config/             # Instância do Prisma Client
│   │   ├── controllers/        # Controladores (Auth, Profile, Links, Products, Subscription, Public)
│   │   ├── middlewares/        # Autenticação JWT e Trava de Planos (planGuard)
│   │   ├── routes/             # Definição das rotas da API REST
│   │   ├── seed.ts             # Script para povoar dados de teste
│   │   └── server.ts           # Inicialização do servidor Express
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── app/
    │   ├── (auth)/             # Telas de Login e Cadastro
    │   ├── (dashboard)/        # Painel do Lojista (Visão Geral, Perfil, Links, Catálogo, Assinatura)
    │   ├── [slug]/             # Página Pública da Loja
    │   ├── icon.svg            # Favicon oficial em SVG
    │   ├── layout.tsx          # Root Layout com Metadados HTML e SEO
    │   └── page.tsx            # Landing Page Institucional
    ├── lib/
    │   └── api.ts              # Cliente HTTP e utilitários de fetch/token
    ├── public/
    ├── package.json
    └── tailwind.config.ts
```

---

## 🔑 Credenciais para Testes Demonstrativos

O projeto possui um script de *seed* que cria automaticamente duas contas de exemplo:

### **1. Lojista PRO (Pizzaria do Zé)**
* **URL Pública**: `http://localhost:3000/pizzaria-do-ze`
* **E-mail**: `lojista@pizzaria.com`
* **Senha**: `123456`
* *Recursos ativos*: 3 links, cor primária laranja (`#EA580C`) e 3 produtos no catálogo do WhatsApp.

### **2. Lojista GRATUITO (Doces da Maria)**
* **URL Pública**: `http://localhost:3000/doces-da-maria`
* **E-mail**: `contato@docesdamaria.com`
* **Senha**: `123456`
* *Recursos ativos*: 2 links, cor padrão e catálogo bloqueado.

---

## ⚙️ Como Executar o Projeto Localmente

### **Pré-requisitos**
* Node.js (versão 18 ou superior)
* npm instalado

---

### **1. Executando o Backend (API REST)**

```bash
# Entre na pasta do backend
cd backend

# Instale as dependências
npm install

# Execute as migrações do banco e o seed inicial
npm run db:push
npm run seed

# Inicie o servidor de desenvolvimento (Porta 4000)
npm run dev
```

---

### **2. Executando o Frontend (Next.js)**

```bash
# Em um novo terminal, entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento (Porta 3000)
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para acessar a aplicação.

---

## 🎓 Créditos Acadêmicos

Desenvolvido para fins de aprendizado como atividade avaliativa no **Curso Técnico em Desenvolvimento de Sistemas**.
