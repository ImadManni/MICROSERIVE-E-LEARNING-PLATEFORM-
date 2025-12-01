$javaHome = "C:\Program Files\Java\jdk-17"
$basePath = $PSScriptRoot

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Services for GraphQL Testing" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $javaHome)) {
    Write-Host "ERROR: JAVA_HOME not found at: $javaHome" -ForegroundColor Red
    exit 1
}

$env:JAVA_HOME = $javaHome
Write-Host "✅ JAVA_HOME: $javaHome" -ForegroundColor Green

Write-Host ""
Write-Host "Starting required services..." -ForegroundColor Yellow
Write-Host ""

function Start-ServiceWindow {
    param(
        [string]$ServiceName,
        [string]$ServicePath,
        [int]$Port
    )
    
    $fullPath = Join-Path $basePath $ServicePath
    if (-not (Test-Path $fullPath)) {
        Write-Host "❌ $ServiceName path not found: $fullPath" -ForegroundColor Red
        return $false
    }
    
    Write-Host "Starting $ServiceName (Port $Port)..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$fullPath'; `$env:JAVA_HOME = '$javaHome'; `$env:JWT_SECRET = 'mySecretKeyForJWTTokenGeneration123456789'; Write-Host '=== $ServiceName (Port $Port) ===' -ForegroundColor Green; mvn spring-boot:run"
    return $true
}

Write-Host "Step 1/4: Starting Eureka Server..." -ForegroundColor Yellow
if (Start-ServiceWindow -ServiceName "Eureka Server" -ServicePath "eureka-server" -Port 8761) {
    Write-Host "⏳ Waiting 20 seconds for Eureka to start..." -ForegroundColor Gray
    Start-Sleep -Seconds 20
}

Write-Host "Step 2/4: Starting Config Server..." -ForegroundColor Yellow
if (Start-ServiceWindow -ServiceName "Config Server" -ServicePath "config-server" -Port 8888) {
    Write-Host "⏳ Waiting 15 seconds for Config Server to start..." -ForegroundColor Gray
    Start-Sleep -Seconds 15
}

Write-Host "Step 3/4: Starting Gateway Service..." -ForegroundColor Yellow
if (Start-ServiceWindow -ServiceName "Gateway Service" -ServicePath "gateway-service" -Port 8080) {
    Write-Host "⏳ Waiting 10 seconds for Gateway to start..." -ForegroundColor Gray
    Start-Sleep -Seconds 10
}

Write-Host "Step 4/4: Starting Cours Service (GraphQL)..." -ForegroundColor Yellow
if (Start-ServiceWindow -ServiceName "Cours Service" -ServicePath "cours-service" -Port 8081) {
    Write-Host "⏳ Waiting 30 seconds for Cours Service to fully start..." -ForegroundColor Gray
    Start-Sleep -Seconds 30
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Services Started!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "GraphQL Endpoint: http://localhost:8081/graphql" -ForegroundColor Cyan
Write-Host ""
Write-Host "Waiting 10 more seconds, then testing..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing GraphQL Endpoint" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$graphqlUrl = "http://localhost:8081/graphql"

$testQuery = @"
{
  courses {
    id
    title
    description
    category {
      id
      name
    }
    professor {
      id
      fullName
      email
    }
    price
    createdAt
  }
}
"@

$body = @{
    query = $testQuery
} | ConvertTo-Json

Write-Host "Testing: Get All Courses Query" -ForegroundColor Yellow
Write-Host "URL: $graphqlUrl" -ForegroundColor Gray
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $graphqlUrl -Method Post -Body $body -ContentType "application/json" -TimeoutSec 10 -ErrorAction Stop
    
    Write-Host "✅ GraphQL Endpoint is Working!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
    
    if ($response.data -and $response.data.courses) {
        $courseCount = $response.data.courses.Count
        Write-Host ""
        Write-Host "✅ Found $courseCount course(s)" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ GraphQL Test Failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "Possible issues:" -ForegroundColor Yellow
    Write-Host "  - Service is still starting (wait 30-60 seconds)" -ForegroundColor White
    Write-Host "  - Port 8081 is not accessible" -ForegroundColor White
    Write-Host "  - MongoDB connection issue" -ForegroundColor White
    Write-Host ""
    Write-Host "Try testing manually:" -ForegroundColor Cyan
    Write-Host "  .\test-graphql.ps1" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Complete" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "GraphQL Endpoint: http://localhost:8081/graphql" -ForegroundColor Green
Write-Host ""
Write-Host "You can now:" -ForegroundColor Yellow
Write-Host "  1. Run: .\test-graphql.ps1 (for more tests)" -ForegroundColor White
Write-Host "  2. Use curl or Postman to test GraphQL queries" -ForegroundColor White
Write-Host "  3. Check service windows for logs" -ForegroundColor White
Write-Host ""

