Write-Host "Testing MongoDB Connection..." -ForegroundColor Cyan
Write-Host ""

$uri = "mongodb+srv://imad:4444qqqq@cluster0.aqwy2gi.mongodb.net/inscription_db?retryWrites=true&w=majority&appName=Cluster0"

Write-Host "Connection String: mongodb+srv://imad:***@cluster0.aqwy2gi.mongodb.net/inscription_db" -ForegroundColor White
Write-Host ""

Write-Host "To test the connection:" -ForegroundColor Yellow
Write-Host "1. Make sure all backend services are running" -ForegroundColor White
Write-Host "2. Register a new user at http://localhost:3000/register" -ForegroundColor White
Write-Host "3. Check MongoDB Atlas -> inscription_db -> students collection" -ForegroundColor White
Write-Host ""

Write-Host "Expected result:" -ForegroundColor Green
Write-Host "  - A new document should appear in inscription_db.students" -ForegroundColor White
Write-Host "  - Document will contain: id, fullName, email, passwordHash, roles, createdAt" -ForegroundColor White
Write-Host ""

Write-Host "If no data appears:" -ForegroundColor Yellow
Write-Host "  - Check service logs for MongoDB connection errors" -ForegroundColor White
Write-Host "  - Verify password is correct: 4444qqqq" -ForegroundColor White
Write-Host "  - Check network access in MongoDB Atlas (should allow 0.0.0.0/0 for dev)" -ForegroundColor White
Write-Host ""

