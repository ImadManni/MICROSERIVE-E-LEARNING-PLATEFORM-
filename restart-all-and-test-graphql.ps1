$javaHome = "C:\Program Files\Java\jdk-17"
$basePath = $PSScriptRoot

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Restart All Services & Test GraphQL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Stopping existing services..." -ForegroundColor Yellow

$ports = @(8761, 8888, 8080, 8081, 8082, 8083)

foreach ($port in $ports) {
    Get-Process -Name java -ErrorAction SilentlyContinue | Where-Object { 
        try {
            $conn = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
            if ($conn) { $conn.OwningProcess -eq $_.Id }
        } catch { $false }
    } | Stop-Process -Force -ErrorAction SilentlyContinue
}

Start-Sleep -Seconds 3
Write-Host "Stopped all existing services" -ForegroundColor Green
Write-Host ""

Write-Host "Step 2: Starting services..." -ForegroundColor Yellow
Write-Host ""

$env:JAVA_HOME = $javaHome
$env:JWT_SECRET = "mySecretKeyForJWTTokenGeneration123456789"

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

Start-ServiceWindow -ServiceName "Eureka Server" -ServicePath "eureka-server" -Port 8761
Start-Sleep -Seconds 20

Start-ServiceWindow -ServiceName "Config Server" -ServicePath "config-server" -Port 8888
Start-Sleep -Seconds 15

Start-ServiceWindow -ServiceName "Gateway Service" -ServicePath "gateway-service" -Port 8080
Start-Sleep -Seconds 10

Start-ServiceWindow -ServiceName "Cours Service" -ServicePath "cours-service" -Port 8081
Start-Sleep -Seconds 30

Write-Host ""
Write-Host "Step 3: Waiting for Cours Service to be ready..." -ForegroundColor Yellow
Write-Host ""

$maxWait = 150
$waited = 0
$interval = 5

while ($waited -lt $maxWait) {
    Start-Sleep -Seconds $interval
    $waited += $interval
    
    $portOpen = Test-NetConnection -ComputerName localhost -Port 8081 -InformationLevel Quiet -WarningAction SilentlyContinue
    
    if ($portOpen) {
        Write-Host "Port 8081 is open! Cours Service is running!" -ForegroundColor Green
        Start-Sleep -Seconds 10
        break
    } else {
        Write-Host "Still waiting... ($waited / $maxWait seconds)" -ForegroundColor Gray
    }
}

if (-not $portOpen) {
    Write-Host "Cours Service did not start in time" -ForegroundColor Red
    Write-Host "Check the service window for errors" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Step 4: Testing GraphQL endpoint..." -ForegroundColor Yellow
Write-Host ""

$graphqlUrl = "http://localhost:8081/graphql"

$testQuery = "{ courses { id title description category { id name } professor { id fullName } price createdAt } }"
$body = @{ query = $testQuery } | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $graphqlUrl -Method Post -Body $body -ContentType "application/json" -TimeoutSec 10 -ErrorAction Stop
    
    Write-Host "GraphQL Endpoint is WORKING!" -ForegroundColor Green
    Write-Host ""
    
    if ($response.data -and $response.data.courses) {
        $count = $response.data.courses.Count
        if ($count -gt 0) {
            Write-Host "Found $count course(s):" -ForegroundColor Green
            $response.data.courses | ForEach-Object {
                Write-Host "  - $($_.title) (ID: $($_.id))" -ForegroundColor White
            }
        } else {
            Write-Host "No courses found yet (database is empty)" -ForegroundColor Yellow
        }
    }
    
} catch {
    Write-Host "GraphQL test failed: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "Service may still be initializing..." -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Services Started!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "GraphQL Endpoint: $graphqlUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "Example GraphQL Queries:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Get All Courses:" -ForegroundColor White
Write-Host '   { courses { id title description price } }' -ForegroundColor Gray
Write-Host ""
Write-Host "2. Get All Courses (Detailed):" -ForegroundColor White
Write-Host '   { courses { id title description category { id name } professor { id fullName email } price createdAt } }' -ForegroundColor Gray
Write-Host ""
Write-Host "3. Get Single Course:" -ForegroundColor White
Write-Host '   { course(id: "1") { id title description price category { name } professor { fullName } } }' -ForegroundColor Gray
Write-Host ""
Write-Host "4. Create Course:" -ForegroundColor White
Write-Host '   mutation { createCourse(input: { title: "Spring Boot Masterclass" description: "Learn Spring Boot" categoryId: "1" professorId: "1" youtubeVideoId: "dQw4w9WgXcQ" price: 99.99 }) { id title price } }' -ForegroundColor Gray
Write-Host ""
Write-Host "Opening GraphQL test page..." -ForegroundColor Cyan
$htmlPath = Join-Path $basePath "graphql-test.html"
if (Test-Path $htmlPath) {
    Start-Process $htmlPath
}
Write-Host ""

