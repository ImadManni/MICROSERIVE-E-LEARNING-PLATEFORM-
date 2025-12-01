$javaHome = "C:\Program Files\Java\jdk-17"
$basePath = $PSScriptRoot

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Complete Test: Add Course & Query GraphQL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "This script will:" -ForegroundColor Yellow
Write-Host "  1. Check if services are running" -ForegroundColor White
Write-Host "  2. Wait for services to be ready" -ForegroundColor White
Write-Host "  3. Add a test course via GraphQL" -ForegroundColor White
Write-Host "  4. Query GraphQL to show all courses" -ForegroundColor White
Write-Host ""

$graphqlUrl = "http://localhost:8081/graphql"

Write-Host "Checking if cours-service is running..." -ForegroundColor Yellow
$port8081 = Test-NetConnection -ComputerName localhost -Port 8081 -InformationLevel Quiet -WarningAction SilentlyContinue

if (-not $port8081) {
    Write-Host "Cours Service is not running!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Starting cours-service..." -ForegroundColor Yellow
    
    $servicePath = Join-Path $basePath "cours-service"
    $env:JAVA_HOME = $javaHome
    $env:JWT_SECRET = "mySecretKeyForJWTTokenGeneration123456789"
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$servicePath'; `$env:JAVA_HOME = '$javaHome'; `$env:JWT_SECRET = 'mySecretKeyForJWTTokenGeneration123456789'; Write-Host '=== Cours Service (Port 8081) ===' -ForegroundColor Green; mvn clean spring-boot:run"
    
    Write-Host "Waiting 90 seconds for service to start..." -ForegroundColor Yellow
    
    $maxWait = 120
    $waited = 0
    while ($waited -lt $maxWait) {
        Start-Sleep -Seconds 5
        $waited += 5
        
        $portOpen = Test-NetConnection -ComputerName localhost -Port 8081 -InformationLevel Quiet -WarningAction SilentlyContinue
        if ($portOpen) {
            Write-Host "Service is ready!" -ForegroundColor Green
            Start-Sleep -Seconds 10
            break
        } else {
            Write-Host "Still waiting... ($waited / $maxWait seconds)" -ForegroundColor Gray
        }
    }
    
    if (-not $portOpen) {
        Write-Host "Service did not start in time" -ForegroundColor Red
        Write-Host "Please check the service window for errors" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "Cours Service is already running!" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 1: Creating Test Course" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Note: If mutation fails (category/professor not found)," -ForegroundColor Yellow
Write-Host "you can add courses via the frontend admin panel instead." -ForegroundColor Yellow
Write-Host ""

$createMutation = @"
mutation {
  createCourse(input: {
    title: "Complete Spring Boot Masterclass"
    description: "Master Spring Boot framework, REST APIs, database integration, and microservices architecture"
    categoryId: "1"
    professorId: "1"
    youtubeVideoId: "dQw4w9WgXcQ"
    price: 149.99
  }) {
    id
    title
    description
    price
  }
}
"@

$mutationBody = @{ query = $createMutation } | ConvertTo-Json

try {
    Write-Host "Creating course via GraphQL..." -ForegroundColor Gray
    $createResponse = Invoke-RestMethod -Uri $graphqlUrl -Method Post -Body $mutationBody -ContentType "application/json" -TimeoutSec 10 -ErrorAction Stop
    
    if ($createResponse.data -and $createResponse.data.createCourse) {
        $course = $createResponse.data.createCourse
        Write-Host "Course created successfully!" -ForegroundColor Green
        Write-Host "  ID: $($course.id)" -ForegroundColor White
        Write-Host "  Title: $($course.title)" -ForegroundColor White
        Write-Host "  Price: `$$($course.price)" -ForegroundColor White
    } elseif ($createResponse.errors) {
        Write-Host "Could not create course via GraphQL (this is OK)" -ForegroundColor Yellow
        Write-Host "Error: $($createResponse.errors[0].message)" -ForegroundColor Gray
        Write-Host ""
        Write-Host "You can add courses via the frontend admin panel instead:" -ForegroundColor Cyan
        Write-Host "  http://localhost:3000/admin/courses" -ForegroundColor White
    }
} catch {
    Write-Host "GraphQL mutation not available or service still starting" -ForegroundColor Yellow
    Write-Host "You can add courses via frontend admin panel" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 2: Querying All Courses from GraphQL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$query = @"
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
    youtubeVideoId
    price
    createdAt
  }
}
"@

$queryBody = @{ query = $query } | ConvertTo-Json

Write-Host "Querying GraphQL endpoint..." -ForegroundColor Gray
Write-Host "Query: Get all courses with full details" -ForegroundColor Gray
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $graphqlUrl -Method Post -Body $queryBody -ContentType "application/json" -TimeoutSec 10 -ErrorAction Stop
    
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "GraphQL Query Results" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    
    if ($response.data -and $response.data.courses) {
        $courses = $response.data.courses
        $count = $courses.Count
        
        if ($count -gt 0) {
            Write-Host "Found $count course(s) in database:" -ForegroundColor Green
            Write-Host ""
            
            for ($i = 0; $i -lt $courses.Count; $i++) {
                $course = $courses[$i]
                Write-Host "Course #$($i + 1):" -ForegroundColor Yellow
                Write-Host "  ID: $($course.id)" -ForegroundColor White
                Write-Host "  Title: $($course.title)" -ForegroundColor White
                Write-Host "  Description: $($course.description)" -ForegroundColor Gray
                
                if ($course.category) {
                    Write-Host "  Category: $($course.category.name) (ID: $($course.category.id))" -ForegroundColor White
                } else {
                    Write-Host "  Category: Not set" -ForegroundColor Gray
                }
                
                if ($course.professor) {
                    Write-Host "  Professor: $($course.professor.fullName) (ID: $($course.professor.id))" -ForegroundColor White
                    if ($course.professor.email) {
                        Write-Host "    Email: $($course.professor.email)" -ForegroundColor Gray
                    }
                } else {
                    Write-Host "  Professor: Not set" -ForegroundColor Gray
                }
                
                if ($course.youtubeVideoId) {
                    Write-Host "  YouTube Video ID: $($course.youtubeVideoId)" -ForegroundColor White
                }
                
                Write-Host "  Price: `$$($course.price)" -ForegroundColor White
                
                if ($course.createdAt) {
                    Write-Host "  Created: $($course.createdAt)" -ForegroundColor Gray
                }
                
                Write-Host ""
            }
            
            Write-Host "Full JSON Response:" -ForegroundColor Cyan
            Write-Host "===================" -ForegroundColor Cyan
            $response | ConvertTo-Json -Depth 10
            Write-Host ""
            
        } else {
            Write-Host "No courses found in database yet" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "To add courses:" -ForegroundColor Cyan
            Write-Host "  1. Make sure frontend is running: npm run dev" -ForegroundColor White
            Write-Host "  2. Go to: http://localhost:3000/admin/courses" -ForegroundColor White
            Write-Host "  3. Click 'Add Course' and fill the form" -ForegroundColor White
            Write-Host "  4. Click 'Create'" -ForegroundColor White
            Write-Host "  5. Run this script again to query GraphQL" -ForegroundColor White
            Write-Host ""
            Write-Host "Or add via GraphQL mutation (if categories/professors exist):" -ForegroundColor Cyan
            Write-Host '  mutation { createCourse(input: { title: "Test" description: "Test" categoryId: "1" professorId: "1" price: 99.99 }) { id title } }' -ForegroundColor Gray
        }
    } elseif ($response.errors) {
        Write-Host "GraphQL returned errors:" -ForegroundColor Red
        $response.errors | ForEach-Object {
            Write-Host "  - $($_.message)" -ForegroundColor Red
        }
        Write-Host ""
        Write-Host "Full response:" -ForegroundColor Yellow
        $response | ConvertTo-Json -Depth 5
    } else {
        Write-Host "Unexpected response:" -ForegroundColor Yellow
        $response | ConvertTo-Json -Depth 10
    }
    
} catch {
    Write-Host "Failed to query GraphQL" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "Possible issues:" -ForegroundColor Yellow
    Write-Host "  - Service is still starting (wait 30 more seconds)" -ForegroundColor White
    Write-Host "  - Check service window for errors" -ForegroundColor White
    Write-Host "  - Verify port 8081 is accessible" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Complete" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "GraphQL Endpoint: $graphqlUrl" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  - Add courses via: http://localhost:3000/admin/courses" -ForegroundColor White
Write-Host "  - Test queries in: graphql-test.html" -ForegroundColor White
Write-Host "  - Run this script again to see new courses" -ForegroundColor White
Write-Host ""

