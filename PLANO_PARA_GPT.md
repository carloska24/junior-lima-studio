# Implementation Plan: Júnior Lima Hair Artist

# Goal Description

Create a premium, sophisticated web platform for "Júnior Lima Hair Artist". The solution will consist of a high-conversion public Landing Page and a private Management System for salon operations. The aesthetic must be elegant, avoiding "tech/cyberpunk" tropes in favor of minimalist luxury.

## User Review Required

> [!IMPORTANT]
> **Aesthetics**: Please confirm the proposed "Midnight & Gold" color palette.
> **Tech Stack**: Proposing React + Vite for high performance.
> **Database**: PostgreSQL + Prisma (Strict adherence to postgres-saas stack).

## Architecture

### Tech Stack

- **Frontend**: React (v18+), TypeScript, Vite
- **Styling**: Tailwind CSS (configured with custom typography and color tokens)
- **Icons**: Lucide React (thin, elegant strokes)
- **Animation**: Framer Motion (for smooth, high-end transitions)
- **State Management**: React Context API & Hooks (Strictly no external state libraries)

### High-Level Structure

```mermaid
graph TD
    Client[Client Browser]

    subgraph "Frontend Application"
        LP[Landing Page (Public)]
        Admin[Management System (Private)]
    end

    LP -->|View Services| Router
    LP -->|Book Online| Router
    Admin -->|Login| Auth
    Admin -->|Manage Schedule| Dashboard

    Router --> Components
    Dashboard --> Stores
```

## UX/UI Design Guidelines

### Visual Identity "Studio Elegance"

- **Mood**: Exclusive, Professional, Artistic, Serene.
- **Colors**:
  - `Primary`: #D4AF37 (Champagne Gold) - Accents, CTAs.
  - `Background`: #0F0F0F (Rich Black) or #FFFFFF (Crisp White) - _Dependant on Dark/Light mode preference, suggesting Dark default for "Premium" feel._
  - `Surface`: #1A1A1A (Soft Charcoal) - Cards, panels.
  - `Text`: #F5F5F5 (Off-white) and #A3A3A3 (Muted silver).
- **Typography**:
  - _Headings_: **Playfair Display** or **Cinzel** (Serif, refined).
  - _Body_: **Inter** or **Lato** (Clean, readable sans-serif).

### Core Components

| Component | Style Notes                                                                                 |
| --------- | ------------------------------------------------------------------------------------------- |
| Actions   | Buttons with thin borders, slight letter-spacing, uppercase text. Gold hover glow (subtle). |
| Cards     | Glassmorphism with very low opacity tint, thin borders, ample padding.                      |
| Images    | High contrast B&W with color on hover, or full saturation with slight vignette.             |

## Proposed Changes (Phase Breakdown)

### 1. Foundation

#### [NEW] `vite.config.ts`, `tailwind.config.e`

- Setup project root with alias imports.
- Define the "Premium" theme in Tailwind config.

### 2. Landing Page Modules

#### [NEW] `src/pages/Landing/Hero.tsx`

- Full-screen impactful visual.
- "Agendar Agora" CTA.

#### [NEW] `src/pages/Landing/Services.tsx`

- Grid of services with price ranges and time estimates.

#### [NEW] `src/pages/Landing/Portfolio.tsx`

- Masonry grid of haircut transformations.

### 3. Management System Modules

#### [MODIFY] `src/pages/Admin/Dashboard.tsx`

- Fetch data from `/dashboard/stats`.
- Display Cards:
  - **Faturamento Total** (Sum of `appointments.totalPrice`).
  - **Total de Atendimentos** (Count of `appointments`).
  - **Clientes** (Count of `clients`).
- Show "Upcoming Appointments" list (Next 5).

### 4. Backend Implementation (Dashboard)

#### [NEW] `src/controllers/DashboardController.ts`

- Method `getStats`:
  - `totalRevenue`: Aggregate `totalPrice`.
  - `totalAppointments`: Count.
  - `activeClients`: Count users.
  - `todayAppointments`: Count where date = Today.

#### [NEW] `src/routes/dashboard.routes.ts`

- GET `/stats` -> `DashboardController.getStats`

#### [NEW] `src/pages/Admin/Agenda.tsx`

- Calendar view.
- Slot management.

### 5. Client Management

#### [NEW] `src/pages/Admin/Clients/index.tsx`

- List all clients (GET `/clients`).
- Search bar (client-side filtering).
- "Novo Cliente" button -> Opens Modal.

#### [NEW] `src/pages/Admin/Clients/ClientForm.tsx`

- Form fields: Name (Required), Phone (Required), Email, Notes.
- Uses `react-hook-form` (optional) or simple state.
- ON SAVE: POST `/clients` or PUT `/clients/:id`.

#### [NEW] `src/components/ui/Table.tsx`

- Reusable styled table component for premium look.

### 6. Service Catalog

#### [NEW] `src/pages/Admin/Services/index.tsx`

- List all active services (GET `/services`).
- "Novo Serviço" button -> Opens Modal.

#### [NEW] `src/pages/Admin/Services/ServiceForm.tsx`

- Form fields: Name, Description, Price, Duration (Min).
- Uses `react-hook-form`.
- ON SAVE: POST `/services` or PUT `/services/:id`.

## Verification Plan

### Manual Verification

- **Visual Check**: Verify the "Premium" feel matches expectations (smooth fonts, correct gold tones).
- **Responsiveness**: Test Landing Page on Mobile (iPhone SE/14 dimensions) and Desktop (1920x1080).
- **Flow**: User clicks "Agendar" -> redirected to booking flow (or WhatsApp link if simple).

## Deployment Strategy (Google Cloud)

### 1. Database (Cloud SQL)

- **Service**: Cloud SQL for PostgreSQL
- **Config**: High output not required for MVP, `db-f1-micro` or `db-custom-1-3840` (Shared Core).
- **Security**: Public IP with reduced access (authorized networks) or Auth Proxy.

### 2. Backend (Cloud Run)

- **Containerization**: Docker
- **Environment**:
  - `DATABASE_URL`: Connection string to Cloud SQL.
  - `JWT_SECRET`: Secure secret.
  - `NODE_ENV`: production.

### 3. Frontend (Firebase Hosting)

- **Build**: `npm run build` (Vite) produces static files in `dist/`.
- **Config**: `firebase.json` rewrites all to `index.html` (SPA).
