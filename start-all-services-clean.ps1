Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting All Backend Services (Clean)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

function Stop-ProcessOnPort {
    param([int]$Port)
    $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if ($connections) {
        $processIds = $connections | Select-Object -ExpandProperty OwningProcess -Unique
        foreach ($processId in $processIds) {
            Write-Host "Stopping process $processId on port $Port..." -ForegroundColor Yellow
            Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        }
        Start-Sleep -Seconds 2
        Write-Host "Port $Port is now free." -ForegroundColor Green
    }
}

$javaHome = "C:\Program Files\Java\jdk-17"
$basePath = "C:\Users\DELL\Desktop\MICROSERVICE E-LEARNING"

Write-Host "MongoDB Configuration:" -ForegroundColor Cyan
Write-Host "  Using MongoDB Atlas: cluster0.aqwy2gi.mongodb.net" -ForegroundColor White
Write-Host "  Set MONGODB_PASSWORD environment variable before starting services" -ForegroundColor Yellow
Write-Host ""
Write-Host "Cleaning up existing processes on service ports..." -ForegroundColor Yellow
Stop-ProcessOnPort -Port 8761
Stop-ProcessOnPort -Port 8888
Stop-ProcessOnPort -Port 8080
Stop-ProcessOnPort -Port 8081
Stop-ProcessOnPort -Port 8082
Stop-ProcessOnPort -Port 8083
Write-Host ""

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
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$basePath\cours-service'; `$env:JAVA_HOME = '$javaHome'; `$env:JWT_SECRET = 'mySecretKeyForJWTTokenGeneration123456789'; `$env:MONGODB_PASSWORD = '${env:MONGODB_PASSWORD}'; Write-Host '=== Cours Service ===' -ForegroundColor Green; Write-Host 'JAVA_HOME:' `$env:JAVA_HOME; Write-Host 'MongoDB: Using Atlas cluster'; mvn spring-boot:run"
Start-Sleep -Seconds 5

Write-Host "Step 5/6: Starting Inscription Service (Port 8082)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$basePath\inscription-service'; `$env:JAVA_HOME = '$javaHome'; `$env:JWT_SECRET = 'mySecretKeyForJWTTokenGeneration123456789'; `$env:MONGODB_PASSWORD = '${env:MONGODB_PASSWORD}'; `$env:GOOGLE_CLIENT_ID = '${env:GOOGLE_CLIENT_ID}'; `$env:GOOGLE_CLIENT_SECRET = '${env:GOOGLE_CLIENT_SECRET}'; Write-Host '=== Inscription Service ===' -ForegroundColor Green; Write-Host 'JAVA_HOME:' `$env:JAVA_HOME; Write-Host 'MongoDB: Using Atlas cluster'; Write-Host 'Note: Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET if not set'; mvn spring-boot:run"
Start-Sleep -Seconds 5

Write-Host "Step 6/6: Starting Statistique Service (Port 8083)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$basePath\statistique-service'; `$env:JAVA_HOME = '$javaHome'; `$env:MONGODB_PASSWORD = '${env:MONGODB_PASSWORD}'; `$env:YOUTUBE_API_KEY = '${env:YOUTUBE_API_KEY}'; Write-Host '=== Statistique Service ===' -ForegroundColor Green; Write-Host 'JAVA_HOME:' `$env:JAVA_HOME; Write-Host 'MongoDB: Using Atlas cluster'; Write-Host 'Note: Set YOUTUBE_API_KEY if not set'; mvn spring-boot:run"

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
Write-Host "IMPORTANT: Set environment variables before starting:" -ForegroundColor Red
Write-Host "  - MONGODB_PASSWORD: Your MongoDB Atlas password" -ForegroundColor Yellow
Write-Host "  - GOOGLE_CLIENT_ID: For OAuth2 authentication" -ForegroundColor Yellow
Write-Host "  - GOOGLE_CLIENT_SECRET: For OAuth2 authentication" -ForegroundColor Yellow
Write-Host "  - YOUTUBE_API_KEY: For YouTube video statistics" -ForegroundColor Yellow
Write-Host ""
Write-Host "Example:" -ForegroundColor Cyan
Write-Host "  `$env:MONGODB_PASSWORD = 'your_mongodb_password'" -ForegroundColor White
Write-Host ""

