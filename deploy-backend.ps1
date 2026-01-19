
# Deploy Backend to Cloud Run
# Usage: ./deploy-backend.ps1

$PROJECT_ID = "junior-lima-studio-app"
$REGION = "southamerica-east1"
$IMAGE = "gcr.io/$PROJECT_ID/junior-lima-backend"
$DB_INSTANCE = "junior-lima-studio-app:southamerica-east1:junior-lima-db"

# 1. Build
Write-Host "Building Backend Image..."
gcloud builds submit --tag $IMAGE ./backend

# 2. Deploy
Write-Host "Deploying to Cloud Run..."
# Note: DATABASE_URL should be set in Cloud Run environment variables once, 
# or passed here if you want to update it.
# We assume it's set or we will set it initially manually.

gcloud run deploy junior-lima-api `
  --image $IMAGE `
  --platform managed `
  --region $REGION `
  --allow-unauthenticated `
  --set-env-vars "NODE_ENV=production"

Write-Host "Backend Deploy Complete!"
