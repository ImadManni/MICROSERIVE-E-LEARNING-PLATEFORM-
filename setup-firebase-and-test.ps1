$basePath = $PSScriptRoot
$coursServicePath = Join-Path $basePath "cours-service"
$javaHome = "C:\Program Files\Java\jdk-17"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Firebase & Test GraphQL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Checking Firebase Service Account Key..." -ForegroundColor Yellow

$serviceAccountPath = Join-Path $coursServicePath "firebase-service-account.json"
$serviceAccountExists = Test-Path $serviceAccountPath

if (-not $serviceAccountExists) {
    Write-Host ""
    Write-Host "⚠️  Firebase Service Account Key NOT FOUND!" -ForegroundColor Red
    Write-Host ""
    Write-Host "To download the service account key:" -ForegroundColor Yellow
    Write-Host "  1. Go to: https://console.firebase.google.com/project/microservice-e-learning/settings/serviceaccounts/adminsdk" -ForegroundColor Cyan
    Write-Host "  2. Click 'Generate new private key'" -ForegroundColor White
    Write-Host "  3. Save the JSON file as: firebase-service-account.json" -ForegroundColor White
    Write-Host "  4. Place it in: $coursServicePath" -ForegroundColor White
    Write-Host ""
    Write-Host "For now, GraphQL will try to use default credentials..." -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "✅ Service account key found: $serviceAccountPath" -ForegroundColor Green
}

Write-Host "Step 2: Stopping existing cours-service..." -ForegroundColor Yellow
Get-Process -Name java -ErrorAction SilentlyContinue | Where-Object { 
    try {
        $conn = Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue
        if ($conn) { $conn.OwningProcess -eq $_.Id }
    } catch { $false }
} | Stop-Process -Force -ErrorAction SilentlyContinue

Start-Sleep -Seconds 2
Write-Host "Stopped" -ForegroundColor Green
Write-Host ""

Write-Host "Step 3: Starting cours-service..." -ForegroundColor Yellow
$env:JAVA_HOME = $javaHome
$env:JWT_SECRET = "mySecretKeyForJWTTokenGeneration123456789"

if ($serviceAccountExists) {
    $env:FIREBASE_CREDENTIALS_PATH = $serviceAccountPath
    Write-Host "Using Firebase service account: $serviceAccountPath" -ForegroundColor Cyan
}
$env:FIREBASE_PROJECT_ID = "microservice-e-learning"

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$coursServicePath'; `$env:JAVA_HOME = '$javaHome'; `$env:JWT_SECRET = 'mySecretKeyForJWTTokenGeneration123456789'; if (Test-Path '$serviceAccountPath') { `$env:FIREBASE_CREDENTIALS_PATH = '$serviceAccountPath' }; `$env:FIREBASE_PROJECT_ID = 'microservice-e-learning'; Write-Host '=== Cours Service (Port 8081) ===' -ForegroundColor Green; Write-Host 'Starting with Firestore integration...' -ForegroundColor Cyan; mvn spring-boot:run"

Write-Host "Service starting..." -ForegroundColor Green
Write-Host "Waiting 90 seconds for compilation and startup..." -ForegroundColor Yellow
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
        Write-Host "Still waiting... ($waited / $maxWait seconds)" -ForegroundColor Gray
    }
}

if (-not $portOpen) {
    Write-Host "Service did not start in time" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 4: Testing GraphQL endpoint..." -ForegroundColor Yellow
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

$body = @{ query = $testQuery } | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $graphqlUrl -Method Post -Body $body -ContentType "application/json" -TimeoutSec 10 -ErrorAction Stop
    
    Write-Host "✅ GraphQL Endpoint is WORKING!" -ForegroundColor Green
    Write-Host ""
    
    if ($response.data -and $response.data.courses) {
        $count = $response.data.courses.Count
        if ($count -gt 0) {
            Write-Host "Found $count course(s) from Firestore:" -ForegroundColor Green
            Write-Host ""
            foreach ($course in $response.data.courses) {
                Write-Host "Course:" -ForegroundColor Yellow
                Write-Host "  ID: $($course.id)" -ForegroundColor White
                Write-Host "  Title: $($course.title)" -ForegroundColor White
                Write-Host "  Description: $($course.description)" -ForegroundColor Gray
                Write-Host "  Price: `$$($course.price)" -ForegroundColor White
                if ($course.category) {
                    Write-Host "  Category: $($course.category.name)" -ForegroundColor White
                }
                if ($course.professor) {
                    Write-Host "  Professor: $($course.professor.fullName)" -ForegroundColor White
                }
                Write-Host ""
            }
        } else {
            Write-Host "No courses found (Firestore is empty or Firebase not configured)" -ForegroundColor Yellow
            Write-Host "Add courses via: http://localhost:3000/admin/courses" -ForegroundColor Cyan
        }
    }
    
    Write-Host "Full Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
    
} catch {
    Write-Host "GraphQL test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Ready to Test!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "GraphQL Endpoint: $graphqlUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test Queries (copy into graphql-test.html):" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Get All Courses:" -ForegroundColor White
Write-Host '   { courses { id title description price } }' -ForegroundColor Gray
Write-Host ""
Write-Host "2. Get Detailed Courses:" -ForegroundColor White
Write-Host '   { courses { id title description category { name } professor { fullName } price createdAt } }' -ForegroundColor Gray
Write-Host ""
Write-Host "3. Get Single Course:" -ForegroundColor White
Write-Host '   { course(id: "YOUR_COURSE_ID") { id title description price } }' -ForegroundColor Gray
Write-Host ""
Write-Host "Opening GraphQL test page..." -ForegroundColor Cyan
$htmlPath = Join-Path $basePath "graphql-test.html"
if (Test-Path $htmlPath) {
    Start-Process $htmlPath
}
Write-Host ""

