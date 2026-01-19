
# Deploy Frontend to Firebase
# Usage: ./deploy-frontend.ps1

# 1. Build
Write-Host "Building Frontend..."
cd frontend
npm install
npm run build
cd ..

# 2. Deploy
Write-Host "Deploying to Firebase Hosting..."
firebase deploy --only hosting

Write-Host "Frontend Deploy Complete!"
