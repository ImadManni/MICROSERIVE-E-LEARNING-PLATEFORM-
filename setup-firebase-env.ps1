Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Firebase Environment Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Your Firebase Project: microservice-e-learning" -ForegroundColor Green
Write-Host ""

Write-Host "To get your Firebase configuration:" -ForegroundColor Yellow
Write-Host "1. Go to: https://console.firebase.google.com/u/0/project/microservice-e-learning/settings/general" -ForegroundColor White
Write-Host "2. Scroll to 'Your apps' section" -ForegroundColor White
Write-Host "3. Click Web icon (</>) to add web app if not exists" -ForegroundColor White
Write-Host "4. Copy the Firebase config values" -ForegroundColor White
Write-Host ""

Write-Host "Create .env.local file with:" -ForegroundColor Yellow
Write-Host ""
Write-Host "NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key" -ForegroundColor Cyan
Write-Host "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=microservice-e-learning.firebaseapp.com" -ForegroundColor Cyan
Write-Host "NEXT_PUBLIC_FIREBASE_PROJECT_ID=microservice-e-learning" -ForegroundColor Cyan
Write-Host "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=microservice-e-learning.appspot.com" -ForegroundColor Cyan
Write-Host "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id" -ForegroundColor Cyan
Write-Host "NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id" -ForegroundColor Cyan
Write-Host ""

Write-Host "Important Firebase Console Links:" -ForegroundColor Yellow
Write-Host "  - Overview: https://console.firebase.google.com/u/0/project/microservice-e-learning/overview" -ForegroundColor White
Write-Host "  - Authentication: https://console.firebase.google.com/u/0/project/microservice-e-learning/authentication/users" -ForegroundColor White
Write-Host "  - Firestore Data: https://console.firebase.google.com/u/0/project/microservice-e-learning/firestore/databases/-default-/data" -ForegroundColor White
Write-Host "  - Project Settings: https://console.firebase.google.com/u/0/project/microservice-e-learning/settings/general" -ForegroundColor White
Write-Host ""

Write-Host "After setup:" -ForegroundColor Yellow
Write-Host "1. Run: pnpm install" -ForegroundColor White
Write-Host "2. Create .env.local with your Firebase config" -ForegroundColor White
Write-Host "3. Run: pnpm dev" -ForegroundColor White
Write-Host "4. Test login at http://localhost:3000/login" -ForegroundColor White
Write-Host "5. Check Firestore for saved users!" -ForegroundColor White
Write-Host ""

