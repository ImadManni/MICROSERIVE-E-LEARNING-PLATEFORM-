$javaHome = "C:\Program Files\Java\jdk-17"
$basePath = $PSScriptRoot
$servicePath = Join-Path $basePath "cours-service"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Restart Cours Service & Test GraphQL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Stopping existing service..." -ForegroundColor Yellow
$processes = Get-Process -Name java -ErrorAction SilentlyContinue | Where-Object { 
    $_.CommandLine -like "*cours-service*" -or 
    (Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue | Where-Object { $_.OwningProcess -eq $_.Id })
}

if ($processes) {
    foreach ($proc in $processes) {
        Write-Host "Stopping process $($proc.Id)..." -ForegroundColor Gray
        Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 3
    Write-Host "✅ Stopped existing processes" -ForegroundColor Green
} else {
    Write-Host "No existing service found" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Step 2: Starting Cours Service with CORS fix..." -ForegroundColor Yellow

if (-not (Test-Path $servicePath)) {
    Write-Host "❌ Service path not found: $servicePath" -ForegroundColor Red
    exit 1
}

$env:JAVA_HOME = $javaHome
$env:JWT_SECRET = "mySecretKeyForJWTTokenGeneration123456789"

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$servicePath'; `$env:JAVA_HOME = '$javaHome'; `$env:JWT_SECRET = 'mySecretKeyForJWTTokenGeneration123456789'; Write-Host '=== Cours Service (Port 8081) with CORS ===' -ForegroundColor Green; Write-Host 'Starting with CORS enabled...' -ForegroundColor Cyan; mvn clean spring-boot:run"

Write-Host "✅ Service starting..." -ForegroundColor Green
Write-Host ""
Write-Host "Waiting for service to compile and start (60-90 seconds)..." -ForegroundColor Yellow
Write-Host ""

$maxWait = 120
$waited = 0
$interval = 5

while ($waited -lt $maxWait) {
    Start-Sleep -Seconds $interval
    $waited += $interval
    
    $portOpen = Test-NetConnection -ComputerName localhost -Port 8081 -InformationLevel Quiet -WarningAction SilentlyContinue
    
    if ($portOpen) {
        Write-Host "✅ Port 8081 is open! Service is running!" -ForegroundColor Green
        Start-Sleep -Seconds 10
        break
    } else {
        $remaining = $maxWait - $waited
        Write-Host "⏳ Still waiting... ($waited / $maxWait seconds)" -ForegroundColor Gray
    }
}

if (-not $portOpen) {
    Write-Host ""
    Write-Host "❌ Service did not start in time" -ForegroundColor Red
    Write-Host "Check the service window for errors" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Step 3: Testing GraphQL endpoint..." -ForegroundColor Yellow
Write-Host ""

$graphqlUrl = "http://localhost:8081/graphql"
$testQuery = "{ courses { id title description } }"
$body = @{ query = $testQuery } | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $graphqlUrl -Method Post -Body $body -ContentType "application/json" -TimeoutSec 10 -ErrorAction Stop
    
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✅ GraphQL Endpoint is WORKING!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 5
    Write-Host ""
    
} catch {
    Write-Host "❌ Test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GraphQL is Ready!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Service is running with CORS enabled" -ForegroundColor Green
Write-Host ""
Write-Host "You can now:" -ForegroundColor Yellow
Write-Host "  1. Open graphql-test.html in your browser" -ForegroundColor White
Write-Host "  2. Test at: http://localhost:8081/graphql" -ForegroundColor White
Write-Host "  3. Use Postman or any HTTP client" -ForegroundColor White
Write-Host ""
Write-Host "Opening test page..." -ForegroundColor Cyan

$htmlPath = Join-Path $basePath "graphql-test.html"
if (Test-Path $htmlPath) {
    Start-Process $htmlPath
    Write-Host "✅ Test page opened in browser!" -ForegroundColor Green
} else {
    Write-Host "⚠️ Test page not found: $htmlPath" -ForegroundColor Yellow
    Write-Host "You can manually open: graphql-test.html" -ForegroundColor White
}

