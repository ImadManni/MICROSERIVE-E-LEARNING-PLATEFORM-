$javaHome = "C:\Program Files\Java\jdk-17"
$basePath = $PSScriptRoot
$servicePath = Join-Path $basePath "cours-service"
$htmlPath = Join-Path $basePath "graphql-test.html"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Restart Service & Open GraphQL Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Stopping existing service..." -ForegroundColor Yellow
Get-Process -Name java -ErrorAction SilentlyContinue | Where-Object { 
    try {
        $conn = Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue
        if ($conn) { $conn.OwningProcess -eq $_.Id }
    } catch { $false }
} | Stop-Process -Force -ErrorAction SilentlyContinue

Start-Sleep -Seconds 2
Write-Host "Stopped existing processes" -ForegroundColor Green
Write-Host ""

Write-Host "Step 2: Starting Cours Service..." -ForegroundColor Yellow
if (-not (Test-Path $servicePath)) {
    Write-Host "Service path not found: $servicePath" -ForegroundColor Red
    exit 1
}

$env:JAVA_HOME = $javaHome
$env:JWT_SECRET = "mySecretKeyForJWTTokenGeneration123456789"

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$servicePath'; `$env:JAVA_HOME = '$javaHome'; `$env:JWT_SECRET = 'mySecretKeyForJWTTokenGeneration123456789'; Write-Host '=== Cours Service (Port 8081) ===' -ForegroundColor Green; Write-Host 'Starting with CORS enabled...' -ForegroundColor Cyan; mvn clean spring-boot:run"

Write-Host "Service starting in new window..." -ForegroundColor Green
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
} catch {
    Write-Host "Service started but GraphQL test failed: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "Service may still be initializing..." -ForegroundColor Gray
}

Write-Host ""
Write-Host "Step 4: Opening HTML test page..." -ForegroundColor Yellow

if (Test-Path $htmlPath) {
    Start-Process $htmlPath
    Write-Host "Test page opened in browser!" -ForegroundColor Green
} else {
    Write-Host "Test page not found: $htmlPath" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Ready to Test!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "GraphQL Endpoint: http://localhost:8081/graphql" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ready-to-Use Test Queries:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Get All Courses:" -ForegroundColor White
Write-Host "   { courses { id title description } }" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Get All Courses (Detailed):" -ForegroundColor White
Write-Host "   { courses { id title description category { id name } professor { id fullName email } price createdAt } }" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Create Spring Boot Course:" -ForegroundColor White
Write-Host '   mutation { createCourse(input: { title: "Introduction to Spring Boot" description: "Learn Spring Boot framework" categoryId: "1" professorId: "1" youtubeVideoId: "dQw4w9WgXcQ" price: 99.99 }) { id title description price } }' -ForegroundColor Gray
Write-Host ""
Write-Host "4. Create React Native Course:" -ForegroundColor White
Write-Host '   mutation { createCourse(input: { title: "React Native Mobile Development" description: "Build cross-platform mobile apps" categoryId: "1" professorId: "1" youtubeVideoId: "f8Z9JyB2EIE" price: 149.99 }) { id title description price } }' -ForegroundColor Gray
Write-Host ""
Write-Host "5. Get Single Course:" -ForegroundColor White
Write-Host '   { course(id: "1") { id title description price category { name } professor { fullName } } }' -ForegroundColor Gray
Write-Host ""
Write-Host "Copy these queries into the HTML test page!" -ForegroundColor Cyan
Write-Host ""
