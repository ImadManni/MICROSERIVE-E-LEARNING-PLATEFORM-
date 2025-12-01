$javaHome = "C:\Program Files\Java\jdk-17"
$basePath = $PSScriptRoot
$servicePath = Join-Path $basePath "cours-service"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Restart Cours Service with Firestore" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Stopping existing cours-service..." -ForegroundColor Yellow
Get-Process -Name java -ErrorAction SilentlyContinue | Where-Object { 
    try {
        $conn = Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue
        if ($conn) { $conn.OwningProcess -eq $_.Id }
    } catch { $false }
} | Stop-Process -Force -ErrorAction SilentlyContinue

Start-Sleep -Seconds 2
Write-Host "Stopped" -ForegroundColor Green
Write-Host ""

Write-Host "Starting cours-service with Firestore integration..." -ForegroundColor Yellow
$env:JAVA_HOME = $javaHome
$env:JWT_SECRET = "mySecretKeyForJWTTokenGeneration123456789"

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$servicePath'; `$env:JAVA_HOME = '$javaHome'; `$env:JWT_SECRET = 'mySecretKeyForJWTTokenGeneration123456789'; Write-Host '=== Cours Service with Firestore (Port 8081) ===' -ForegroundColor Green; Write-Host 'GraphQL will read courses from Firestore!' -ForegroundColor Cyan; mvn clean spring-boot:run"

Write-Host "Service starting..." -ForegroundColor Green
Write-Host "Waiting 60-90 seconds for compilation and startup..." -ForegroundColor Yellow
Write-Host ""

$maxWait = 120
$waited = 0
$interval = 5

while ($waited -lt $maxWait) {
    Start-Sleep -Seconds $interval
    $waited += $interval
    
    $portOpen = Test-NetConnection -ComputerName localhost -Port 8081 -InformationLevel Quiet -WarningAction SilentlyContinue
    
    if ($portOpen) {
        Write-Host "Port 8081 is open! Service is running!" -ForegroundColor Green
        Start-Sleep -Seconds 10
        break
    } else {
        Write-Host "Still waiting... ($waited / $maxWait seconds)" -ForegroundColor Gray
    }
}

if (-not $portOpen) {
    Write-Host "Service did not start in time" -ForegroundColor Red
    Write-Host "Check the service window for errors" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Service Ready!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Now you can:" -ForegroundColor Yellow
Write-Host "  1. Add courses via: http://localhost:3000/admin/courses" -ForegroundColor White
Write-Host "  2. Query GraphQL: http://localhost:8081/graphql" -ForegroundColor White
Write-Host "  3. Courses added in frontend will appear in GraphQL!" -ForegroundColor White
Write-Host ""
Write-Host "Test query:" -ForegroundColor Cyan
Write-Host '  { courses { id title description price } }' -ForegroundColor Gray
Write-Host ""

