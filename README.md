# Junior Lima Studio ✂️

> **Uma plataforma full-stack de gestão para estúdios de beleza, focada em experiência "Luxury" e performance mobile.**

![Project Banner](docs/assets/banner.png)
_(Substitua este link por um print real da sua Landing Page)_

## 🚀 Sobre o Projeto

O **Junior Lima Studio** não é apenas um site de agendamento. É uma solução completa que une **conversão de clientes** (Landing Page imersiva) com **eficiência operacional** (Painel Administrativo).

O objetivo foi resolver o problema comum de estúdios de beleza: sites bonitos mas lentos, ou sistemas de gestão rápidos mas feios. Aqui, unimos os dois mundos.

### ✨ Diferenciais Técnicos (Para Recrutadores)

- **Performance a 60fps**: Implementação manual de aceleração de hardware (`transform: translateZ(0)`) para garantir scroll suave em devices mobile, mesmo com animações complexas.
- **Arquitetura Híbrida**: Frontend **Modular Monolith** organizado por domínios de negócio (evitando a "gaveta de bagunça" de componentes) + Backend **Clean Architecture** simplificada.
- **Stack de Ponta**: Já utilizando **React 19**, **Tailwind CSS v4** (Oxide Engine) e **Express 5.0** (Beta) para aproveitar as features mais recentes do ecossistema JS.

---

## 🛠 Stack Tecnológica

### Frontend (Client & Admin)

- **Core**: React 19.2.0 + TypeScript 5.9
- **Build**: Vite 7.2 (HMR instantâneo)
- **Styling**: Tailwind CSS 4.0 (Design Tokens via CSS Variables)
- **Motion**: Framer Motion 12 (Gestos de "Swipe & Hold" estilo Instagram)
- **State**: React Context (Auth e Perfil)

### Backend (API REST)

- **Runtime**: Node.js v20+
- **Framework**: Express 5.0 (Tratamento de erros async nativo)
- **Database**: PostgreSQL
- **ORM**: Prisma 7.2 (Type-safety ponta a ponta)
- **Security**: JWT Auth + Bcrypt

---

## 📸 Funcionalidades

### 📱 Cliente Final (Mobile First)

- **Story Viewer**: Visualização de portfólio idêntica ao Instagram Stories (toque para pausar, swipe para navegar).
- **Agendamento Real-time**: Seleção de horário baseada na duração real dos serviços somados.

### 💼 Painel Administrativo

- **Agenda Drag-and-Drop**: Visualização semanal e diária.
- **CMS Integrado**: Upload de fotos e vídeos direto para a Landing Page.
- **Relatórios**: Visão financeira rápida.

---

## 🔧 Como Rodar Localmente

### Pré-requisitos

- Node.js 20+
- PostgreSQL
- Yarn ou Npm

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/junior-lima-studio.git

# 2. Setup Backend
cd backend
npm install
cp .env.example .env # Configure seu Banco de Dados
npx prisma migrate dev
npm run dev

# 3. Setup Frontend
cd ../frontend
npm install
npm run dev
```

---

## 🧠 Decisões de Arquitetura

### Por que Tailwind v4?

Ao invés de usar CSS-in-JS (que onera o runtime), optamos pelo Tailwind v4 para gerar CSS estático purificado. Isso garante que o site carregue instantaneamente mesmo em 3G.

### UX "Instagram-like"

Percebi que o público-alvo (clientes de beleza) está acostumado com a navegação do Instagram. Ao invés de reinventar a roda, repliquei a UX de Stories (barras de progresso, gestos de toque) para reduzir a fricção cognitiva.

---

## 👨‍💻 Autor

**Carlos Alexandre Duarte Pereira** (DevNaPratica)

Desafio limites técnicos para criar experiências de usuário memoráveis.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/seu-linkedin)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/seu-github)

---

> _Este projeto foi desenvolvido como caso de estudo de arquitetura full-stack moderna._
