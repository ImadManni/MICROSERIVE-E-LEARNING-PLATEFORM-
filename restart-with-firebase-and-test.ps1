$javaHome = "C:\Program Files\Java\jdk-17"
$basePath = $PSScriptRoot
$servicePath = Join-Path $basePath "cours-service"
$serviceAccountPath = Join-Path $servicePath "firebase-service-account.json"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Restart with Firebase & Test GraphQL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Checking Firebase credentials..." -ForegroundColor Yellow
if (Test-Path $serviceAccountPath) {
    Write-Host "✅ Firebase service account key found!" -ForegroundColor Green
} else {
    Write-Host "❌ Firebase service account key NOT found: $serviceAccountPath" -ForegroundColor Red
    exit 1
}

Write-Host ""
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

Write-Host "Step 3: Starting cours-service with Firebase..." -ForegroundColor Yellow
$env:JAVA_HOME = $javaHome
$env:JWT_SECRET = "mySecretKeyForJWTTokenGeneration123456789"
$env:FIREBASE_CREDENTIALS_PATH = $serviceAccountPath
$env:FIREBASE_PROJECT_ID = "microservice-e-learning"

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$servicePath'; `$env:JAVA_HOME = '$javaHome'; `$env:JWT_SECRET = 'mySecretKeyForJWTTokenGeneration123456789'; `$env:FIREBASE_CREDENTIALS_PATH = '$serviceAccountPath'; `$env:FIREBASE_PROJECT_ID = 'microservice-e-learning'; Write-Host '=== Cours Service with Firebase (Port 8081) ===' -ForegroundColor Green; Write-Host 'Firebase configured! GraphQL will read from Firestore!' -ForegroundColor Cyan; mvn clean spring-boot:run"

Write-Host "Service starting with Firebase integration..." -ForegroundColor Green
Write-Host "Waiting 90 seconds for compilation and startup..." -ForegroundColor Yellow
Write-Host ""

$maxWait = 150
$waited = 0
$interval = 5

while ($waited -lt $maxWait) {
    Start-Sleep -Seconds $interval
    $waited += $interval
    
    $portOpen = Test-NetConnection -ComputerName localhost -Port 8081 -InformationLevel Quiet -WarningAction SilentlyContinue
    
    if ($portOpen) {
        Write-Host "✅ Port 8081 is open! Service is running!" -ForegroundColor Green
        Start-Sleep -Seconds 15
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
Write-Host "Step 4: Testing GraphQL endpoint with Firestore..." -ForegroundColor Yellow
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
            Write-Host "🎉 SUCCESS! Found $count course(s) from Firestore:" -ForegroundColor Green
            Write-Host ""
            foreach ($course in $response.data.courses) {
                Write-Host "Course:" -ForegroundColor Yellow
                Write-Host "  ID: $($course.id)" -ForegroundColor White
                Write-Host "  Title: $($course.title)" -ForegroundColor White
                Write-Host "  Description: $($course.description)" -ForegroundColor Gray
                Write-Host "  Price: `$$($course.price)" -ForegroundColor White
                if ($course.category) {
                    Write-Host "  Category: $($course.category.name) (ID: $($course.category.id))" -ForegroundColor White
                }
                if ($course.professor) {
                    Write-Host "  Professor: $($course.professor.fullName) (ID: $($course.professor.id))" -ForegroundColor White
                }
                if ($course.createdAt) {
                    Write-Host "  Created: $($course.createdAt)" -ForegroundColor Gray
                }
                Write-Host ""
            }
        } else {
            Write-Host "No courses found in Firestore yet" -ForegroundColor Yellow
            Write-Host "Add courses via: http://localhost:3000/admin/courses" -ForegroundColor Cyan
        }
    }
    
    Write-Host "Full JSON Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
    
} catch {
    Write-Host "GraphQL test failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Yellow
    }
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

