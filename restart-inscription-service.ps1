Write-Host "Restarting Inscription Service..." -ForegroundColor Cyan
Write-Host ""

$port = 8082
$processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique

if ($processes) {
    Write-Host "Stopping inscription-service on port $port..." -ForegroundColor Yellow
    foreach ($pid in $processes) {
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        Write-Host "Stopped process $pid" -ForegroundColor Green
    }
    Start-Sleep -Seconds 3
}

$javaHome = "C:\Program Files\Java\jdk-17"
$basePath = "C:\Users\DELL\Desktop\MICROSERVICE E-LEARNING"

Write-Host "Starting inscription-service..." -ForegroundColor Yellow
Write-Host "MongoDB Connection: mongodb+srv://imad:***@cluster0.aqwy2gi.mongodb.net/inscription_db" -ForegroundColor White
Write-Host ""

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$basePath\inscription-service'; `$env:JAVA_HOME = '$javaHome'; `$env:JWT_SECRET = 'mySecretKeyForJWTTokenGeneration123456789'; Write-Host '=== Inscription Service ===' -ForegroundColor Green; Write-Host 'JAVA_HOME:' `$env:JAVA_HOME; Write-Host 'MongoDB: Using Atlas cluster with password 4444qqqq'; mvn spring-boot:run"

Write-Host ""
Write-Host "Service is starting..." -ForegroundColor Green
Write-Host "Wait 30-60 seconds for the service to fully start, then test OAuth login." -ForegroundColor Yellow
Write-Host ""

