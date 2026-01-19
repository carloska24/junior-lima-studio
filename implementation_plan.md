# Implementation Plan - Phase 6: User Management (Admin)

## Goal

Implement a complete User Management system for administrators, including profile management, password updates, and CRUD operations for other admin users.

## Proposed Changes

### 1. Database

- **`backend/prisma/schema.prisma`**
  - Add `active Boolean @default(true)` to `User` model to allow activating/deactivating users.

### 2. Backend

- **`backend/src/routes/user.routes.ts`** (New File)
  - `GET /me`: Return current user profle.
  - `PUT /me/password`: Update current user password.
  - `GET /`: List all users (Admin only).
  - `POST /`: Create new user (Admin only).
  - `PUT /:id/toggle-active`: Activate/Deactivate user (Admin only).
- **`backend/src/controllers/UserController.ts`** (New File)
  - Implement methods for the routes above.
- **`backend/src/middleware/auth.ts`** (Verify/Create)
  - Ensure JWT authentication middleware is robust and reusable for these routes.
- **`backend/src/routes/index.ts`**
  - Register `userRoutes` under `/users`.

### 3. Frontend

- **`frontend/src/services/api.ts`** (Verify)
  - Ensure `apiFetch` handles headers correctly (Authorization).
- **`frontend/src/pages/Admin/Profile/index.tsx`** (New Page)
  - Display user info.
  - Form to change password.
- **`frontend/src/pages/Admin/Users/index.tsx`** (New Page)
  - List users with status (Active/Inactive).
  - "Add User" Modal.
  - Actions: Toggle active status.
- **`frontend/src/layouts/AdminLayout.tsx`**
  - Add "Profile" and "Logout" in a user dropdown (Avatar).
  - Add "Usuários" to the sidebar logic (maybe restricted to specific roles later, but strictly accessible for this phase).

## Verification Plan

1.  **Database:** Run migration `npx prisma migrate dev --name add_user_active`.
2.  **Backend:** Test endpoints via Insomnia/Curl (Login -> Get Token -> Call /users).
3.  **Frontend:**
    - Login.
    - Go to Profile -> Change Password -> Re-login.
    - Go to Users -> Create new User -> Login with new User.
    - Disable User -> Try to Login with disabled user (should fail).
