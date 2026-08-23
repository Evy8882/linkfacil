# 🚀 LinkFácil - Centralizador de Links & Catálogo no WhatsApp

> 🌐 **Deploy em Produção (Vercel)**: [https://linkfacil-rho.vercel.app/](https://linkfacil-rho.vercel.app/)  
> 🔗 **API Backend (Render)**: [https://linkfacil.onrender.com/](https://linkfacil.onrender.com/)  
> 📌 **Nota Acadêmica**: Este projeto é uma **simulação de software SaaS (Software as a Service)** desenvolvida exclusivamente como atividade prática para o **Curso Técnico em Desenvolvimento de Sistemas**.

---

## 👥 Autores do Projeto

* 👨‍💻 **Everton Nascimento Mancio**
* 👨‍💻 **Rafael D'Angelo Gradilone Pontes**

---

## 📖 Sobre o Projeto

O **LinkFácil** é uma plataforma desenvolvida para microempreendedores e pequenos negócios criarem uma página única no formato `linkfacil-rho.vercel.app/[slug]`. A solução permite organizar links de contato e exibir um **mini-catálogo de produtos** com botão de pedido direto no WhatsApp (`https://wa.me/...`).

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

## 🔑 Credenciais para Testes Demonstrativos

O projeto possui um script de *seed* que cria automaticamente duas contas de exemplo:

### **1. Lojista PRO (Pizzaria do Zé)**
* **URL Pública em Produção**: [https://linkfacil-rho.vercel.app/pizzaria-do-ze](https://linkfacil-rho.vercel.app/pizzaria-do-ze)
* **E-mail**: `lojista@pizzaria.com`
* **Senha**: `123456`
* *Recursos ativos*: 3 links, cor primária laranja (`#EA580C`) e 3 produtos no catálogo do WhatsApp.

### **2. Lojista GRATUITO (Doces da Maria)**
* **URL Pública em Produção**: [https://linkfacil-rho.vercel.app/doces-da-maria](https://linkfacil-rho.vercel.app/doces-da-maria)
* **E-mail**: `contato@docesdamaria.com`
* **Senha**: `123456`
* *Recursos ativos*: 2 links, cor padrão e catálogo bloqueado.

---

## ⚙️ Como Executar o Projeto Localmente

```bash
# Executar o backend (Porta 4000)
cd backend
npm install
npm run db:push && npm run seed
npm run dev

# Executar o frontend (Porta 3000) em outro terminal
cd frontend
npm install
npm run dev
```

---

## 🌐 Deploy em Produção

- **Frontend**: Hospedado na Vercel em [https://linkfacil-rho.vercel.app/](https://linkfacil-rho.vercel.app/)
- **Backend API**: Hospedado no Render em [https://linkfacil.onrender.com/](https://linkfacil.onrender.com/)

---

## 🎓 Créditos Acadêmicos

Desenvolvido para fins de aprendizado por **Everton Nascimento Mancio** e **Rafael D'Angelo Gradilone Pontes** como atividade avaliativa do **Curso Técnico em Desenvolvimento de Sistemas**.
