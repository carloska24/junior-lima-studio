# Guia de Deploy - Júnior Lima Hair Artist

Este guia detalha o processo de publicação do sistema em ambiente de produção utilizando Google Cloud Platform e Firebase.

## 1. Pré-requisitos

- Conta no Google Cloud (GCP)
- Google Cloud SDK (gcloud CLI) instalado e autenticado
- Node.js e NPM instalados
- Docker instalado (opcional, para testes locais)

## 2. Configuração do Banco de Dados (Cloud SQL)

1.  Acesse o Console do GCP > Cloud SQL.
2.  Clique em **Criar Instância** > **PostgreSQL**.
3.  **Configurações:**
    - **ID da instância:** `junior-lima-db` (O projeto é `junior-lima-studio-app`)
    - **Senha:** Crie uma senha forte e salve-a.
    - **Versão:** PostgreSQL 15 ou superior.
    - **Região:** `southamerica-east1` (São Paulo) para menor latência.
    - **Edição:** Enterprise ou Standard (para produção) ou Sandbox (para testes, mais barato).
4.  **Conectividade:**
    - Em "Redes", adicione uma rede autorizada `0.0.0.0/0` (apenas para facilitar o setup inicial, depois restrinja ao Cloud Run) ou configure "IP privado" e VPC se preferir maior segurança.
5.  **Criação do Banco:**
    - Na aba "Bancos de dados", crie um banco chamado `junior-lima-studio`.

## 3. Deploy do Backend (Cloud Run)

O backend já possui um `Dockerfile` configurado na pasta `backend/`.

1.  **Habilitar APIs:**

    ```powershell
    gcloud services enable cloudbuild.googleapis.com run.googleapis.com
    ```

2.  **Configurar Projeto:**

    ```powershell
    gcloud config set project junior-lima-studio-app
    ```

3.  **Build e Push da Imagem:**
    Navegue até a pasta `backend` e execute:

    ```powershell
    gcloud builds submit --tag gcr.io/junior-lima-studio-app/junior-lima-backend
    ```

4.  **Deploy no Cloud Run:**
    Substitua `SUA_SENHA_DB` e `SEU_IP_CLOUDSQL` pelos valores reais.

    ```powershell
    gcloud run deploy junior-lima-api \
      --image gcr.io/junior-lima-studio-app/junior-lima-backend \
      --platform managed \
      --region southamerica-east1 \
      --allow-unauthenticated \
      --set-env-vars "NODE_ENV=production" \
      --set-env-vars "JWT_SECRET=super-secret-jwt-key-change-this" \
      --set-env-vars "DATABASE_URL=postgresql://postgres:SUA_SENHA_DB@SEU_IP_CLOUDSQL:5432/junior-lima-studio?schema=public"
    ```

5.  **Migrations:**
    Como o Cloud Run é stateless, rode as migrations conectando-se localmente ao banco remoto ou via um _Job_ do Cloud Run. Para simplificar, conecte localmente:
    - Atualize seu `.env` local na pasta `backend` com a `DATABASE_URL` de produção.
    - Execute: `npx prisma migrate deploy`

6.  **Copie a URL:**
    Após o deploy, o Cloud Run exibirá a URL do serviço.

    **URL de Produção (Backend):** `https://junior-lima-api-410975528187.southamerica-east1.run.app`

## 4. Deploy do Frontend (Firebase Hosting)

1.  **Configurar Variável de Ambiente:**
    Crie um arquivo `.env.production` na pasta `frontend` com o conteúdo abaixo (use a URL copiados do passo anterior):

    ```env
    VITE_API_URL=https://junior-lima-api-xyz.a.run.app
    ```

2.  **Instalar Firebase CLI:**

    ```powershell
    npm install -g firebase-tools
    firebase login
    ```

3.  **Inicializar Firebase:**
    Na raiz do projeto (frontend):

    ```powershell
    firebase init hosting
    ```

    - **Use an existing project:** Selecione seu projeto GCP.
    - **Public directory:** `dist`
    - **Configure as a single-page app:** Sim (`y`)
    - **Set up automatic builds and deploys with GitHub:** Não (`N`)

4.  **Build do Frontend:**

    ```powershell
    cd frontend
    npm install
    npm run build
    ```

    Isso criará a pasta `dist` otimizada para produção.

5.  **Deploy:**

    ```powershell
    firebase deploy --only hosting
    ```

    ```powershell
    firebase deploy --only hosting --project junior-lima-studio-app-1da7b
    ```

    **URL de Produção (Frontend):** `https://junior-lima-studio-app-1da7b.web.app`

## 5. Checklist de Produção

- [ ] **Banco de Dados:** Instância rodando e acessível.
- [ ] **Migrations:** Schema do Prisma aplicado via `npx prisma migrate deploy`.
- [ ] **Backend:** Serviço respondendo (teste `/dashboard/stats` ou rota simples).
- [ ] **Frontend:** Variável `VITE_API_URL` apontando para o backend HTTPS.
- [ ] **Segurança:** `JWT_SECRET` forte configurado no Cloud Run.
- [ ] **Domínio:** (Opcional) Configurar domínio personalizado no Firebase Hosting.
- [ ] **Admin:** Teste o login e o fluxo de agendamento no ambiente de produção.

## Dicas Finais

- **Logs:** Use o painel "Logs" do Cloud Run para debugar erros no backend.
- **Custos:** Cloud Run e Firebase tem níveis gratuitos generosos, mas monitore o Cloud SQL que é cobrado por hora.

---

## 6. Deploy Automático (CI/CD com GitHub Actions)

O projeto possui automação de deploy via GitHub Actions. Ao fazer push para a branch `main`, os workflows são disparados automaticamente.

### Workflows Configurados

| Arquivo                                 | Trigger               | Ação                                                       |
| --------------------------------------- | --------------------- | ---------------------------------------------------------- |
| `.github/workflows/deploy-backend.yml`  | Push em `backend/**`  | Build Docker → Push → Deploy Cloud Run → Migrations → Seed |
| `.github/workflows/deploy-frontend.yml` | Push em `frontend/**` | Build → Deploy Firebase Hosting                            |

### Secrets Necessários (GitHub Settings > Secrets)

| Secret                         | Descrição                                                         |
| ------------------------------ | ----------------------------------------------------------------- |
| `DATABASE_URL_PRODUCTION`      | URL completa do PostgreSQL: `postgresql://user:pass@host:5432/db` |
| `GCP_CREDENTIALS`              | JSON da Service Account do GCP                                    |
| `JWT_SECRET`                   | Chave secreta para tokens JWT                                     |
| `FIREBASE_SERVICE_ACCOUNT_...` | Service Account do Firebase para deploy                           |

### Fluxo do Backend

```
1. Build Docker (usa prisma.config.ts para validar)
2. Push para Artifact Registry
3. Deploy no Cloud Run
4. Run Migrations (npx prisma migrate deploy)
5. Seed Database (node prisma/seed.js)
```

---

## 7. Prisma 7 - Notas de Compatibilidade

> ⚠️ **IMPORTANTE:** O Prisma 7 tem uma arquitetura diferente das versões anteriores!

### O que mudou no Prisma 7

| Antes (Prisma < 7)                             | Agora (Prisma 7)                         |
| ---------------------------------------------- | ---------------------------------------- |
| `url = env("DATABASE_URL")` no `schema.prisma` | **DEPRECATED** - Causa erro de validação |
| `new PrismaClient()` simples                   | Requer **adapter** para conexão          |
| Configuração implícita                         | Requer `prisma.config.ts` explícito      |

### Arquivos Críticos para Prisma 7

1. **`prisma.config.ts`** (raiz do backend)

   ```typescript
   import 'dotenv/config';
   import { defineConfig } from 'prisma/config';

   export default defineConfig({
     schema: 'prisma/schema.prisma',
     migrations: { path: 'prisma/migrations' },
     datasource: {
       url: process.env['DATABASE_URL'],
     },
   });
   ```

2. **`schema.prisma`** (NÃO inclua `url`!)

   ```prisma
   datasource db {
     provider = "postgresql"
     // NÃO adicione url aqui no Prisma 7!
   }
   ```

3. **`src/lib/prisma.ts`** (Conexão com adapter)

   ```typescript
   import { PrismaClient } from '@prisma/client';
   import { PrismaPg } from '@prisma/adapter-pg';
   import { Pool } from 'pg';

   const pool = new Pool({ connectionString: process.env.DATABASE_URL });
   const adapter = new PrismaPg(pool);
   export const prisma = new PrismaClient({ adapter });
   ```

4. **`prisma/seed.js`** (Deve usar o MESMO padrão do adapter!)

   ```javascript
   const { PrismaClient } = require('@prisma/client');
   const { PrismaPg } = require('@prisma/adapter-pg');
   const { Pool } = require('pg');

   const pool = new Pool({ connectionString: process.env.DATABASE_URL });
   const adapter = new PrismaPg(pool);
   const prisma = new PrismaClient({ adapter });
   ```

### Dockerfile para Prisma 7

O Dockerfile precisa:

1. Copiar `prisma.config.ts`
2. Definir `DATABASE_URL` placeholder para o build

```dockerfile
# Placeholder para prisma generate funcionar no build
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"

COPY prisma.config.ts ./
COPY prisma ./prisma/

RUN npx prisma generate
```

### Troubleshooting Comum

| Erro                                             | Causa                           | Solução                                |
| ------------------------------------------------ | ------------------------------- | -------------------------------------- |
| `datasource property url is no longer supported` | `url` no schema.prisma          | Remover linha `url = env()` do schema  |
| `PrismaClientConstructorValidationError`         | Falta adapter                   | Usar `PrismaPg` + `Pool` no construtor |
| `Validation Error Count: 1 [getConfig]`          | prisma.config.ts não encontrado | Copiar arquivo no Dockerfile           |
| Seed falha com `***` mascarado                   | `DATABASE_URL` não injetado     | Usar `env:` no step do workflow        |
