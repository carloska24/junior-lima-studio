# Dossiê do Projeto - Júnior Lima Hair Artist

**Data de Atualização:** 18 de Janeiro de 2026
**Responsável Técnico:** Agente "Antigravity" (Google Deepmind)
**Status:** Produção (Online)

---

## 1. Visão Geral

O projeto **Júnior Lima Studio App** é uma plataforma fullstack para gestão e agendamento de serviços de beleza. Ele oferece um site institucional público para clientes e um painel administrativo protegido para o gestor.

### Links de Produção

- **Frontend (Site):** [https://junior-lima-studio-app-1da7b.web.app](https://junior-lima-studio-app-1da7b.web.app)
- **Backend (API):** [https://junior-lima-api-410975528187.southamerica-east1.run.app](https://junior-lima-api-410975528187.southamerica-east1.run.app)
- **Repositório (Local):** `c:\Users\joaob\OneDrive\Área de Trabalho\Trilha do Corte\JuniorLimaStudio`

### Credenciais de Acesso (Admin)

- **Email:** `admin@juniorlima.com`
- **Senha:** `admin123`
- **Rota de Login:** `/login`

---

## 2. Arquitetura do Sistema

O sistema segue uma arquitetura separada (Client-Server), onde o Frontend consome uma API RESTful fornecida pelo Backend.

### Infraestrutura (Google Cloud Platform & Firebase)

| Componente             | Serviço Utilizado  | Detalhes                                               |
| ---------------------- | ------------------ | ------------------------------------------------------ |
| **Frontend**           | Firebase Hosting   | Hospedagem estática (CDN global), HTTPS automático.    |
| **Backend**            | Cloud Run          | Container Docker stateless, autoscaling de 0 a N.      |
| **Banco de Dados**     | Cloud SQL          | PostgreSQL 15 Enterprise, região `southamerica-east1`. |
| **Container Registry** | Container Registry | Armazenamento das imagens Docker do backend.           |

---

## 3. Stack Tecnológica

### Frontend (`/frontend`)

Single Page Application (SPA) moderna, focada em performance e ux.

- **Linguagem:** TypeScript 5.9
- **Framework:** React 19 + Vite 7
- **Estilização:** TailwindCSS 4 (Utility-first CSS)
- **Roteamento:** React Router 7
- **Animações:** Framer Motion 12
- **Ícones:** Lucide React
- **HTTP Client:** Fetch API (com wrapper customizado)

### Backend (`/backend`)

API REST robusta, tipada e containerizada.

- **Linguagem:** TypeScript 5.9 (executado via Node.js 22)
- **Runtime:** Node.js 22 (Alpine Linux no Docker)
- **Framework Web:** Express 5.2
- **ORM:** Prisma 7.2 (PostgreSQL Adapter)
- **Banco de Dados:** PostgreSQL 15
- **Autenticação:** JWT (JSON Web Tokens) com bcryptjs para hash de senhas
- **Utilitários:** `date-fns` (manipulação de datas), `uuid` (IDs únicos)

---

## 4. Estrutura do Banco de Dados

O banco de dados possui as seguintes tabelas principais (definidas em `schema.prisma`):

1.  **Users (`users`):** Administradores do sistema (Nome, Email, Senha).
2.  **Clients (`clients`):** Base de clientes (Nome, Telefone, Email, Notas).
3.  **Services (`services`):** Catálogo de serviços (Nome, Preço, Duração, Ativo/Inativo).
4.  **Appointments (`appointments`):** Agendamentos (Data, Status, Cliente, Serviços, Preço Final).
    - Relacionamento N:N com Serviços (um agendamento pode ter vários serviços).

---

## 5. Processo de Deploy

### Backend

1.  **Build:** Imagem Docker criada localmente e enviada para o Google Container Registry (GCR).
    - Comando: `gcloud builds submit --tag gcr.io/...`
2.  **Deploy:** Serviço Cloud Run atualizado com a nova imagem.
    - Comando: `gcloud run deploy ...`
3.  **Migrations:** Schema do banco atualizado via Prisma Migrate.
    - Comando: `npx prisma migrate deploy`

### Frontend

1.  **Build:** Transpilação do TypeScript/React para HTML/CSS/JS estático (`/dist`).
    - Comando: `npm run build`
2.  **Hosting:** Upload dos arquivos estáticos para o Firebase Hosting.
    - Comando: `firebase deploy --only hosting`

---

## 6. Configuração de Ambiente

### Variáveis de Ambiente (Backend - Produção)

Configuradas diretamente no Cloud Run:

- `NODE_ENV`: `production`
- `PORT`: `3000` (ou porta interna do container)
- `DATABASE_URL`: String de conexão com o Cloud SQL (via Socket Unix).
- `JWT_SECRET`: Chave secreta para assinatura de tokens.

### Variáveis de Ambiente (Frontend - Produção)

Arquivo `.env.production` no build:

- `VITE_API_URL`: URL do Cloud Run (`https://junior-lima-api-...`)

---

## 7. Status Atual

- [x] Infraestrutura configurada e ativa.
- [x] Backend respondendo requisições.
- [x] Banco de dados populado com usuário admin inicial.
- [x] Frontend acessível publicamente e conectado ao backend.
- [x] Fluxo de Login Admin testado.

Este dossiê deve ser mantido atualizado conforme novas funcionalidades forem adicionadas.
