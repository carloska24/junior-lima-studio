# CI/CD Implementation Plan - GitHub Actions

## Goal

Automate the deployment process so that a `git push` to the `main` branch automatically deploys:

1.  **Frontend** to Firebase Hosting.
2.  **Backend** to Google Cloud Run.

## Prerequisite: GitHub Secrets

For GitHub (the cloud) to invoke commands on Google Cloud/Firebase, it needs "keys". These cannot be stored in the code (unsafe). They must be added to **GitHub Repository Settings > Secrets and variables > Actions**.

Required Secrets:

1.  `GCP_CREDENTIALS`: A JSON Service Account Key with permissions for Cloud Run and Artifact Registry.
2.  `FIREBASE_SERVICE_ACCOUNT_JUNIOR_LIMA_STUDIO_APP_1DA7B`: The service account key for Firebase Hosting (or a generic `FIREBASE_SERVICE_ACCOUNT` name we choose).

## Proposed Workflows

### 1. Frontend Workflow (`.github/workflows/deploy-frontend.yml`)

- **Trigger:** Push to `main`.
- **Paths:** Only when files in `frontend/**` change.
- **Steps:**
  - Checkout code.
  - Install Node dependencies (`npm login` / `npm ci`).
  - Build Project (`npm run build`).
  - Deploy to Firebase Hosting (`firebase deploy`).

### 2. Backend Workflow (`.github/workflows/deploy-backend.yml`)

- **Trigger:** Push to `main`.
- **Paths:** Only when files in `backend/**` or `prisma/**` change.
- **Steps:**
  - Checkout code.
  - Auth with Google Cloud.
  - Configure Docker with GCloud.
  - Build Docker Image.
  - Push to Container Registry (GCR).
  - Deploy to Cloud Run.
  - Run Database Migrations.

## Action Plan

1.  Create `.github/workflows` directory.
2.  Create `deploy-frontend.yml`.
3.  Create `deploy-backend.yml`.
4.  **Critical Step:** Guide the user on how to generate/retrieve the keys and add them to GitHub.
