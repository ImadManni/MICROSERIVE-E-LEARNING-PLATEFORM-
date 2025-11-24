Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting All Backend Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$javaHome = "C:\Program Files\Java\jdk-17"
$basePath = "C:\Users\DELL\Desktop\MICROSERVICE E-LEARNING"

Write-Host "Step 1/6: Starting Eureka Server (Port 8761)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$basePath\eureka-server'; `$env:JAVA_HOME = '$javaHome'; Write-Host '=== Eureka Server ===' -ForegroundColor Green; Write-Host 'JAVA_HOME:' `$env:JAVA_HOME; mvn spring-boot:run"
Start-Sleep -Seconds 15

Write-Host "Step 2/6: Starting Config Server (Port 8888)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$basePath\config-server'; `$env:JAVA_HOME = '$javaHome'; Write-Host '=== Config Server ===' -ForegroundColor Green; Write-Host 'JAVA_HOME:' `$env:JAVA_HOME; mvn spring-boot:run"
Start-Sleep -Seconds 10

Write-Host "Step 3/6: Starting Gateway Service (Port 8080)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$basePath\gateway-service'; `$env:JAVA_HOME = '$javaHome'; `$env:JWT_SECRET = 'mySecretKeyForJWTTokenGeneration123456789'; Write-Host '=== Gateway Service ===' -ForegroundColor Green; Write-Host 'JAVA_HOME:' `$env:JAVA_HOME; mvn spring-boot:run"
Start-Sleep -Seconds 10

Write-Host "Step 4/6: Starting Cours Service (Port 8081)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$basePath\cours-service'; `$env:JAVA_HOME = '$javaHome'; `$env:JWT_SECRET = 'mySecretKeyForJWTTokenGeneration123456789'; Write-Host '=== Cours Service ===' -ForegroundColor Green; Write-Host 'JAVA_HOME:' `$env:JAVA_HOME; mvn spring-boot:run"
Start-Sleep -Seconds 5

Write-Host "Step 5/6: Starting Inscription Service (Port 8082)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$basePath\inscription-service'; `$env:JAVA_HOME = '$javaHome'; `$env:JWT_SECRET = 'mySecretKeyForJWTTokenGeneration123456789'; `$env:GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; `$env:GOOGLE_CLIENT_SECRET = 'YOUR_GOOGLE_CLIENT_SECRET'; Write-Host '=== Inscription Service ===' -ForegroundColor Green; Write-Host 'JAVA_HOME:' `$env:JAVA_HOME; Write-Host 'Note: Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in this window'; mvn spring-boot:run"
Start-Sleep -Seconds 5

Write-Host "Step 6/6: Starting Statistique Service (Port 8083)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$basePath\statistique-service'; `$env:JAVA_HOME = '$javaHome'; `$env:YOUTUBE_API_KEY = 'YOUR_YOUTUBE_API_KEY'; Write-Host '=== Statistique Service ===' -ForegroundColor Green; Write-Host 'JAVA_HOME:' `$env:JAVA_HOME; Write-Host 'Note: Set YOUTUBE_API_KEY in this window'; mvn spring-boot:run"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "All services are starting!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Service URLs:" -ForegroundColor Yellow
Write-Host "  - Eureka Dashboard: http://localhost:8761" -ForegroundColor White
Write-Host "  - Gateway (API): http://localhost:8080" -ForegroundColor White
Write-Host "  - OAuth2 Login: http://localhost:8080/oauth2/authorization/google" -ForegroundColor White
Write-Host ""
Write-Host "Note: It may take 1-2 minutes for all services to fully start." -ForegroundColor Yellow
Write-Host "Check the PowerShell windows for startup logs." -ForegroundColor Yellow
Write-Host ""
Write-Host "IMPORTANT: Update environment variables in the service windows:" -ForegroundColor Red
Write-Host "  - Inscription Service: Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET" -ForegroundColor Yellow
Write-Host "  - Statistique Service: Set YOUTUBE_API_KEY" -ForegroundColor Yellow
Write-Host ""

