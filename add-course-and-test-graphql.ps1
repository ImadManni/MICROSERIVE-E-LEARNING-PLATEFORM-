Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Add Course & Test GraphQL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$graphqlUrl = "http://localhost:8081/graphql"

Write-Host "Step 1: Checking if services are running..." -ForegroundColor Yellow
$port8081 = Test-NetConnection -ComputerName localhost -Port 8081 -InformationLevel Quiet -WarningAction SilentlyContinue

if (-not $port8081) {
    Write-Host "Cours Service (port 8081) is not running!" -ForegroundColor Red
    Write-Host "Please start services first: .\start-all-and-test.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host "Services are running" -ForegroundColor Green
Write-Host ""

Write-Host "Step 2: Creating a test course via GraphQL mutation..." -ForegroundColor Yellow
Write-Host ""

$createMutation = @"
mutation {
  createCourse(input: {
    title: "Introduction to Spring Boot"
    description: "Learn Spring Boot framework from scratch. Build REST APIs, work with databases, and implement security."
    categoryId: "1"
    professorId: "1"
    youtubeVideoId: "dQw4w9WgXcQ"
    price: 99.99
  }) {
    id
    title
    description
    price
    category {
      id
      name
    }
    professor {
      id
      fullName
    }
  }
}
"@

$mutationBody = @{ query = $createMutation } | ConvertTo-Json

Write-Host "Creating course: 'Introduction to Spring Boot'..." -ForegroundColor Gray

try {
    $createResponse = Invoke-RestMethod -Uri $graphqlUrl -Method Post -Body $mutationBody -ContentType "application/json" -TimeoutSec 10 -ErrorAction Stop
    
    if ($createResponse.data -and $createResponse.data.createCourse) {
        $course = $createResponse.data.createCourse
        Write-Host "Course created successfully!" -ForegroundColor Green
        Write-Host "  ID: $($course.id)" -ForegroundColor White
        Write-Host "  Title: $($course.title)" -ForegroundColor White
        Write-Host "  Price: `$$($course.price)" -ForegroundColor White
    } elseif ($createResponse.errors) {
        Write-Host "Mutation returned errors:" -ForegroundColor Yellow
        $createResponse.errors | ForEach-Object {
            Write-Host "  - $($_.message)" -ForegroundColor Red
        }
        Write-Host ""
        Write-Host "Note: If you see 'Category not found' or 'Professor not found'," -ForegroundColor Yellow
        Write-Host "you need to add categories and professors first via the admin panel." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Alternatively, add courses via the frontend admin panel:" -ForegroundColor Cyan
        Write-Host "  http://localhost:3000/admin/courses" -ForegroundColor White
    }
} catch {
    Write-Host "Failed to create course via GraphQL: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "This is OK - you can add courses via the frontend admin panel instead." -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Step 3: Querying all courses from GraphQL..." -ForegroundColor Yellow
Write-Host ""

$query = "{ courses { id title description category { id name } professor { id fullName } price createdAt } }"
$queryBody = @{ query = $query } | ConvertTo-Json

Write-Host "Querying GraphQL endpoint..." -ForegroundColor Gray
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
            Write-Host "Found $count course(s):" -ForegroundColor Green
            Write-Host ""
            
            foreach ($course in $courses) {
                Write-Host "Course #$($courses.IndexOf($course) + 1):" -ForegroundColor Yellow
                Write-Host "  ID: $($course.id)" -ForegroundColor White
                Write-Host "  Title: $($course.title)" -ForegroundColor White
                Write-Host "  Description: $($course.description)" -ForegroundColor Gray
                if ($course.category) {
                    Write-Host "  Category: $($course.category.name) (ID: $($course.category.id))" -ForegroundColor White
                }
                if ($course.professor) {
                    Write-Host "  Professor: $($course.professor.fullName) (ID: $($course.professor.id))" -ForegroundColor White
                }
                Write-Host "  Price: `$$($course.price)" -ForegroundColor White
                if ($course.createdAt) {
                    Write-Host "  Created: $($course.createdAt)" -ForegroundColor Gray
                }
                Write-Host ""
            }
            
            Write-Host "Full JSON Response:" -ForegroundColor Cyan
            $response | ConvertTo-Json -Depth 10
        } else {
            Write-Host "No courses found in database" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "To add courses:" -ForegroundColor Cyan
            Write-Host "  1. Go to: http://localhost:3000/admin/courses" -ForegroundColor White
            Write-Host "  2. Click 'Add Course'" -ForegroundColor White
            Write-Host "  3. Fill the form and create" -ForegroundColor White
            Write-Host "  4. Run this script again to query GraphQL" -ForegroundColor White
        }
    } elseif ($response.errors) {
        Write-Host "GraphQL returned errors:" -ForegroundColor Red
        $response.errors | ConvertTo-Json
    } else {
        Write-Host "Unexpected response format:" -ForegroundColor Yellow
        $response | ConvertTo-Json -Depth 10
    }
    
} catch {
    Write-Host "Failed to query GraphQL: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Complete" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "GraphQL Endpoint: $graphqlUrl" -ForegroundColor Green
Write-Host ""
Write-Host "You can also:" -ForegroundColor Yellow
Write-Host "  - Open graphql-test.html for interactive testing" -ForegroundColor White
Write-Host "  - Add more courses via admin panel" -ForegroundColor White
Write-Host "  - Query GraphQL with custom queries" -ForegroundColor White
Write-Host ""

