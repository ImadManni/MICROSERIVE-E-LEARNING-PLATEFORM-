$javaHome = "C:\Program Files\Java\jdk-17"
$basePath = $PSScriptRoot
$servicePath = Join-Path $basePath "cours-service"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Start & Test GraphQL Endpoint" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $javaHome)) {
    Write-Host "❌ JAVA_HOME not found: $javaHome" -ForegroundColor Red
    exit 1
}

Write-Host "Step 1: Starting Cours Service..." -ForegroundColor Yellow
Write-Host ""

if (-not (Test-Path $servicePath)) {
    Write-Host "❌ Service path not found: $servicePath" -ForegroundColor Red
    exit 1
}

$env:JAVA_HOME = $javaHome
$env:JWT_SECRET = "mySecretKeyForJWTTokenGeneration123456789"

Write-Host "Starting service in new window..." -ForegroundColor Gray
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$servicePath'; `$env:JAVA_HOME = '$javaHome'; `$env:JWT_SECRET = 'mySecretKeyForJWTTokenGeneration123456789'; Write-Host '=== Cours Service (Port 8081) ===' -ForegroundColor Green; Write-Host 'Starting...' -ForegroundColor Cyan; mvn clean spring-boot:run"

Write-Host "✅ Service starting..." -ForegroundColor Green
Write-Host ""
Write-Host "Waiting for service to compile and start..." -ForegroundColor Yellow
Write-Host "This may take 60-90 seconds..." -ForegroundColor Gray
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
        Write-Host ""
        Write-Host "Waiting 10 more seconds for GraphQL to initialize..." -ForegroundColor Gray
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
    Write-Host ""
    Write-Host "Please check:" -ForegroundColor Yellow
    Write-Host "  1. The service window for compilation errors" -ForegroundColor White
    Write-Host "  2. MongoDB connection (check application.yml)" -ForegroundColor White
    Write-Host "  3. Java/Maven installation" -ForegroundColor White
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "  - Compilation errors (check mapper files)" -ForegroundColor White
    Write-Host "  - MongoDB connection failed" -ForegroundColor White
    Write-Host "  - Port 8081 already in use" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing GraphQL Endpoint" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$graphqlUrl = "http://localhost:8081/graphql"

Write-Host "Endpoint: $graphqlUrl" -ForegroundColor Yellow
Write-Host ""

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

Write-Host "Sending GraphQL query: Get All Courses" -ForegroundColor Gray
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $graphqlUrl -Method Post -Body $body -ContentType "application/json" -TimeoutSec 10 -ErrorAction Stop
    
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✅ GraphQL Endpoint is WORKING!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Full Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
    Write-Host ""
    
    if ($response.data -and $response.data.courses) {
        $count = $response.data.courses.Count
        Write-Host "✅ Found $count course(s) in database" -ForegroundColor Green
        Write-Host ""
        
        foreach ($course in $response.data.courses) {
            Write-Host "Course: $($course.title)" -ForegroundColor Yellow
            Write-Host "  ID: $($course.id)" -ForegroundColor Gray
            if ($course.category) {
                Write-Host "  Category: $($course.category.name)" -ForegroundColor Gray
            }
            if ($course.professor) {
                Write-Host "  Professor: $($course.professor.fullName)" -ForegroundColor Gray
            }
            if ($course.price) {
                Write-Host "  Price: `$$($course.price)" -ForegroundColor Gray
            }
            Write-Host ""
        }
    } elseif ($response.errors) {
        Write-Host "⚠️ GraphQL returned errors:" -ForegroundColor Yellow
        $response.errors | ConvertTo-Json
    } else {
        Write-Host "✅ Query executed successfully" -ForegroundColor Green
        Write-Host "No courses in database yet (this is normal)" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "GraphQL Endpoint is Ready!" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "You can now test GraphQL queries:" -ForegroundColor Yellow
    Write-Host "  URL: $graphqlUrl" -ForegroundColor White
    Write-Host "  Method: POST" -ForegroundColor White
    Write-Host "  Content-Type: application/json" -ForegroundColor White
    Write-Host ""
    Write-Host "Example query:" -ForegroundColor Yellow
    Write-Host '  { "query": "{ courses { id title } }" }' -ForegroundColor Gray
    Write-Host ""
    
} catch {
    Write-Host "❌ GraphQL Test Failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host ""
        Write-Host "Response Body:" -ForegroundColor Yellow
        Write-Host $responseBody -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "Possible issues:" -ForegroundColor Yellow
    Write-Host "  - GraphQL endpoint not configured correctly" -ForegroundColor White
    Write-Host "  - Service still initializing (wait 30 more seconds)" -ForegroundColor White
    Write-Host "  - Check service logs in the service window" -ForegroundColor White
}

