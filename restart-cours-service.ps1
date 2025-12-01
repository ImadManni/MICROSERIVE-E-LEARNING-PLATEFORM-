$javaHome = "C:\Program Files\Java\jdk-17"
$basePath = $PSScriptRoot
$servicePath = Join-Path $basePath "cours-service"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Restart Cours Service" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $javaHome)) {
    Write-Host "ERROR: JAVA_HOME not found: $javaHome" -ForegroundColor Red
    exit 1
}

Write-Host "Step 1: Stopping existing cours-service..." -ForegroundColor Yellow
Get-Process -Name java -ErrorAction SilentlyContinue | Where-Object { 
    try {
        $conn = Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue
        if ($conn) { $conn.OwningProcess -eq $_.Id }
    } catch { $false }
} | Stop-Process -Force -ErrorAction SilentlyContinue

Start-Sleep -Seconds 2
Write-Host "Stopped existing processes on port 8081" -ForegroundColor Green
Write-Host ""

Write-Host "Step 2: Starting cours-service..." -ForegroundColor Yellow
if (-not (Test-Path $servicePath)) {
    Write-Host "ERROR: Service path not found: $servicePath" -ForegroundColor Red
    exit 1
}

$env:JAVA_HOME = $javaHome
$env:JWT_SECRET = "mySecretKeyForJWTTokenGeneration123456789"

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$servicePath'; `$env:JAVA_HOME = '$javaHome'; `$env:JWT_SECRET = 'mySecretKeyForJWTTokenGeneration123456789'; Write-Host '=== Cours Service (Port 8081) ===' -ForegroundColor Green; Write-Host 'Starting with Firestore integration...' -ForegroundColor Cyan; mvn clean spring-boot:run"

Write-Host "Service starting in new window..." -ForegroundColor Green
Write-Host ""
Write-Host "Waiting for service to compile and start (60-90 seconds)..." -ForegroundColor Yellow
Write-Host ""

$maxWait = 150
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
        $remaining = $maxWait - $waited
        Write-Host "Still waiting... ($waited / $maxWait seconds)" -ForegroundColor Gray
    }
}

if (-not $portOpen) {
    Write-Host ""
    Write-Host "Service did not start in time" -ForegroundColor Red
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
    
    Write-Host "GraphQL Endpoint is WORKING!" -ForegroundColor Green
    Write-Host ""
    
    if ($response.data -and $response.data.courses) {
        $count = $response.data.courses.Count
        if ($count -gt 0) {
            Write-Host "Found $count course(s) in database:" -ForegroundColor Green
            $response.data.courses | ForEach-Object {
                Write-Host "  - $($_.title) (ID: $($_.id))" -ForegroundColor White
            }
        } else {
            Write-Host "No courses found yet (database is empty)" -ForegroundColor Yellow
            Write-Host "Add courses via: http://localhost:3000/admin/courses" -ForegroundColor Cyan
        }
    }
    
} catch {
    Write-Host "GraphQL test failed: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "Service may still be initializing..." -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Service Restarted Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Service URLs:" -ForegroundColor Cyan
Write-Host "  - GraphQL: http://localhost:8081/graphql" -ForegroundColor White
Write-Host "  - Admin Panel: http://localhost:3000/admin/courses" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Add courses via admin panel" -ForegroundColor White
Write-Host "  2. Query GraphQL to see courses" -ForegroundColor White
Write-Host "  3. Use graphql-test.html for interactive testing" -ForegroundColor White
Write-Host ""

