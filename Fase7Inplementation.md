# Implementation Plan - Phase 7: Studio Settings

## Goal Description

Make all institutional data (name, contact, address, hours) editable via the Admin Panel and dynamically consumed by the Landing Page, removing hardcoded values.

## User Review Required

> [!IMPORTANT]
> This requires a database migration to add the `StudioSettings` table.
> The seed script will be updated to populate the initial "Junior Lima Hair Artist" data.

## Proposed Changes

### Backend

#### [MODIFY] [schema.prisma](<file:///c:/Users/joaob/OneDrive/Área de Trabalho/Trilha do Corte/JuniorLimaStudio/backend/prisma/schema.prisma>)

- Add `StudioSettings` model.
  - `id` (String, uuid)
  - `name` (String)
  - `email` (String)
  - `phone` (String)
  - `whatsapp` (String)
  - `address` (String)
  - `city` (String)
  - `openingHours` (String - storing structured text or JSON)
  - `instagramUrl` (String)
  - `updatedAt` (DateTime)

#### [NEW] [StudioController.ts](<file:///c:/Users/joaob/OneDrive/Área de Trabalho/Trilha do Corte/JuniorLimaStudio/backend/src/controllers/StudioController.ts>)

- `getSettings`: Returns the single settings record.
- `updateSettings`: Updates the settings record.

#### [MODIFY] [routes.ts](<file:///c:/Users/joaob/OneDrive/Área de Trabalho/Trilha do Corte/JuniorLimaStudio/backend/src/routes.ts>)

- Add `/studio` routes (GET/PUT).

#### [MODIFY] [seed.ts](<file:///c:/Users/joaob/OneDrive/Área de Trabalho/Trilha do Corte/JuniorLimaStudio/backend/prisma/seed.ts>)

- Add logic to ensure `StudioSettings` exists with the provided default values.

### Frontend

#### [NEW] [Settings/index.tsx](<file:///c:/Users/joaob/OneDrive/Área de Trabalho/Trilha do Corte/JuniorLimaStudio/frontend/src/pages/Admin/Settings/index.tsx>)

- Use `react-hook-form`.
- Grouped sections: Identity, Contact, Address, Hours, Social.
- Fetch on mount, PUT on save.

#### [MODIFY] [App.tsx](<file:///c:/Users/joaob/OneDrive/Área de Trabalho/Trilha do Corte/JuniorLimaStudio/frontend/src/App.tsx>)

- Add route `/admin/settings`.

#### [MODIFY] [Landing Page Components]

- `Footer.tsx`, `ContactSection.tsx`, `Hero.tsx` (wherever hardcoded strings exist).
- Fetch settings context or prop drilling to display dynamic data.
- _Note: User specifically requested Landing Page consumption._

## Verification Plan

### Automated Tests

- N/A (Manual Project)

### Manual Verification

1.  **Seed**: Run migration and seed, check DB for initial data.
2.  **Admin**: Go to `/admin/settings`, edit values, save, reload to verify persistence.
3.  **Public**: Go to Home, verify footer/contact info matches the edited settings.
