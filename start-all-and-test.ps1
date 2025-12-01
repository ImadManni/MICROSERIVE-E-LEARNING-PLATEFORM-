$javaHome = "C:\Program Files\Java\jdk-17"
$basePath = $PSScriptRoot

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Start All Services & Test GraphQL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $javaHome)) {
    Write-Host "ERROR: JAVA_HOME not found: $javaHome" -ForegroundColor Red
    exit 1
}

$env:JAVA_HOME = $javaHome
$env:JWT_SECRET = "mySecretKeyForJWTTokenGeneration123456789"

Write-Host "Step 1: Starting Backend Services..." -ForegroundColor Yellow
Write-Host ""

function Start-ServiceWindow {
    param(
        [string]$ServiceName,
        [string]$ServicePath,
        [int]$Port
    )
    
    $fullPath = Join-Path $basePath $ServicePath
    if (-not (Test-Path $fullPath)) {
        Write-Host "Path not found: $fullPath" -ForegroundColor Red
        return $false
    }
    
    Write-Host "Starting $ServiceName (Port $Port)..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$fullPath'; `$env:JAVA_HOME = '$javaHome'; `$env:JWT_SECRET = 'mySecretKeyForJWTTokenGeneration123456789'; Write-Host '=== $ServiceName (Port $Port) ===' -ForegroundColor Green; mvn spring-boot:run"
    return $true
}

Write-Host "Starting Eureka Server..." -ForegroundColor Yellow
Start-ServiceWindow -ServiceName "Eureka Server" -ServicePath "eureka-server" -Port 8761
Start-Sleep -Seconds 20

Write-Host "Starting Config Server..." -ForegroundColor Yellow
Start-ServiceWindow -ServiceName "Config Server" -ServicePath "config-server" -Port 8888
Start-Sleep -Seconds 15

Write-Host "Starting Gateway Service..." -ForegroundColor Yellow
Start-ServiceWindow -ServiceName "Gateway Service" -ServicePath "gateway-service" -Port 8080
Start-Sleep -Seconds 10

Write-Host "Starting Cours Service (GraphQL)..." -ForegroundColor Yellow
Start-ServiceWindow -ServiceName "Cours Service" -ServicePath "cours-service" -Port 8081
Start-Sleep -Seconds 30

Write-Host "Starting Inscription Service..." -ForegroundColor Yellow
Start-ServiceWindow -ServiceName "Inscription Service" -ServicePath "inscription-service" -Port 8082
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "Step 2: Waiting for services to be ready..." -ForegroundColor Yellow
Write-Host ""

$ports = @(8761, 8888, 8080, 8081, 8082)
$allReady = $false
$maxWait = 180
$waited = 0

while ($waited -lt $maxWait -and -not $allReady) {
    Start-Sleep -Seconds 5
    $waited += 5
    
    $readyCount = 0
    foreach ($port in $ports) {
        $portOpen = Test-NetConnection -ComputerName localhost -Port $port -InformationLevel Quiet -WarningAction SilentlyContinue
        if ($portOpen) {
            $readyCount++
        }
    }
    
    if ($readyCount -eq $ports.Count) {
        $allReady = $true
        Write-Host "All services are ready!" -ForegroundColor Green
    } else {
        Write-Host "Waiting for services... ($readyCount / $($ports.Count) ready)" -ForegroundColor Gray
    }
}

if (-not $allReady) {
    Write-Host "Some services did not start in time" -ForegroundColor Yellow
    Write-Host "Continuing anyway..." -ForegroundColor Gray
}

Write-Host ""
Write-Host "Step 3: Starting Frontend..." -ForegroundColor Yellow

$frontendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$basePath'; Write-Host '=== Frontend (Next.js) ===' -ForegroundColor Green; npm run dev" -PassThru

Write-Host "Frontend starting..." -ForegroundColor Green
Write-Host "Waiting 15 seconds for frontend to start..." -ForegroundColor Gray
Start-Sleep -Seconds 15

Write-Host ""
Write-Host "Step 4: Testing GraphQL Endpoint..." -ForegroundColor Yellow
Write-Host ""

$graphqlUrl = "http://localhost:8081/graphql"

$testQuery = "{ courses { id title description category { id name } professor { id fullName } price createdAt } }"
$body = @{ query = $testQuery } | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $graphqlUrl -Method Post -Body $body -ContentType "application/json" -TimeoutSec 10 -ErrorAction Stop
    
    Write-Host "GraphQL Endpoint is WORKING!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Current courses in database:" -ForegroundColor Cyan
    
    if ($response.data -and $response.data.courses -and $response.data.courses.Count -gt 0) {
        $count = $response.data.courses.Count
        Write-Host "Found $count course(s):" -ForegroundColor Green
        $response.data.courses | ForEach-Object {
            Write-Host "  - $($_.title) (ID: $($_.id))" -ForegroundColor White
        }
    } else {
        Write-Host "No courses found yet (database is empty)" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "GraphQL test failed: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "Service may still be starting..." -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "All Services Started!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Service URLs:" -ForegroundColor Cyan
Write-Host "  - Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  - Admin Panel: http://localhost:3000/admin/courses" -ForegroundColor White
Write-Host "  - GraphQL: http://localhost:8081/graphql" -ForegroundColor White
Write-Host "  - Eureka: http://localhost:8761" -ForegroundColor White
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Open: http://localhost:3000/admin/courses" -ForegroundColor White
Write-Host "  2. Click 'Add Course'" -ForegroundColor White
Write-Host "  3. Fill the form and create a course" -ForegroundColor White
Write-Host "  4. Test GraphQL query to see the course" -ForegroundColor White
Write-Host ""
Write-Host "Opening admin panel in browser..." -ForegroundColor Cyan
Start-Sleep -Seconds 5
Start-Process "http://localhost:3000/admin/courses"

Write-Host ""
Write-Host "Opening GraphQL test page..." -ForegroundColor Cyan
$htmlPath = Join-Path $basePath "graphql-test.html"
if (Test-Path $htmlPath) {
    Start-Sleep -Seconds 2
    Start-Process $htmlPath
}

Write-Host ""
Write-Host "Ready to test! Add a course in the admin panel, then query GraphQL." -ForegroundColor Green
Write-Host ""

