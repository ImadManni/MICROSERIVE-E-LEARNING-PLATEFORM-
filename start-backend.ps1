# Script to start all backend microservices
# Make sure MySQL is running before executing this script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting LearnHub Backend Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Maven is installed
try {
    $mvnVersion = mvn -version 2>&1
    Write-Host "Maven found: $($mvnVersion[0])" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Maven is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Maven and add it to your PATH" -ForegroundColor Red
    exit 1
}

# Function to start a service
function Start-Service {
    param(
        [string]$ServiceName,
        [string]$ServicePath,
        [int]$Port
    )
    
    Write-Host "Starting $ServiceName on port $Port..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ServicePath'; Write-Host 'Starting $ServiceName...' -ForegroundColor Cyan; mvn spring-boot:run"
    Start-Sleep -Seconds 5
}

# Start services in order
Write-Host "Step 1/6: Starting Eureka Server (Port 8761)..." -ForegroundColor Cyan
Start-Service -ServiceName "Eureka Server" -ServicePath "$PSScriptRoot\eureka-server" -Port 8761

Write-Host "Waiting 15 seconds for Eureka to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host "Step 2/6: Starting Config Server (Port 8888)..." -ForegroundColor Cyan
Start-Service -ServiceName "Config Server" -ServicePath "$PSScriptRoot\config-server" -Port 8888

Write-Host "Waiting 10 seconds for Config Server to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "Step 3/6: Starting Gateway Service (Port 8080)..." -ForegroundColor Cyan
Start-Service -ServiceName "Gateway Service" -ServicePath "$PSScriptRoot\gateway-service" -Port 8080

Write-Host "Waiting 10 seconds for Gateway to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "Step 4/6: Starting Cours Service (Port 8081)..." -ForegroundColor Cyan
Start-Service -ServiceName "Cours Service" -ServicePath "$PSScriptRoot\cours-service" -Port 8081

Write-Host "Step 5/6: Starting Inscription Service (Port 8082)..." -ForegroundColor Cyan
Start-Service -ServiceName "Inscription Service" -ServicePath "$PSScriptRoot\inscription-service" -Port 8082

Write-Host "Step 6/6: Starting Statistique Service (Port 8083)..." -ForegroundColor Cyan
Start-Service -ServiceName "Statistique Service" -ServicePath "$PSScriptRoot\statistique-service" -Port 8083

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "All services are starting!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Service URLs:" -ForegroundColor Cyan
Write-Host "  - Eureka Dashboard: http://localhost:8761" -ForegroundColor White
Write-Host "  - Gateway (API): http://localhost:8080" -ForegroundColor White
Write-Host "  - OAuth2 Login: http://localhost:8080/oauth2/authorization/google" -ForegroundColor White
Write-Host ""
Write-Host "Note: It may take 1-2 minutes for all services to fully start." -ForegroundColor Yellow
Write-Host "Check the PowerShell windows for startup logs." -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

