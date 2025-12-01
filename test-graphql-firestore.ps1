$graphqlUrl = "http://localhost:8081/graphql"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test GraphQL with Firestore Courses" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Query 1: Get All Courses" -ForegroundColor Yellow
Write-Host ""

$query1 = @"
{
  courses {
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
    createdAt
  }
}
"@

$body1 = @{ query = $query1 } | ConvertTo-Json

try {
    $response1 = Invoke-RestMethod -Uri $graphqlUrl -Method Post -Body $body1 -ContentType "application/json" -TimeoutSec 10 -ErrorAction Stop
    
    Write-Host "Response:" -ForegroundColor Green
    if ($response1.data -and $response1.data.courses) {
        $count = $response1.data.courses.Count
        Write-Host "Found $count course(s)" -ForegroundColor Green
        Write-Host ""
        
        if ($count -gt 0) {
            foreach ($course in $response1.data.courses) {
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
            Write-Host "No courses found. Add courses via admin panel first." -ForegroundColor Yellow
        }
    }
    
    Write-Host "Full JSON Response:" -ForegroundColor Cyan
    $response1 | ConvertTo-Json -Depth 10
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Ready-to-Use GraphQL Queries" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Get All Courses:" -ForegroundColor Yellow
Write-Host '   { courses { id title description price } }' -ForegroundColor Gray
Write-Host ""
Write-Host "2. Get Detailed Courses:" -ForegroundColor Yellow
Write-Host '   { courses { id title description category { name } professor { fullName } price createdAt } }' -ForegroundColor Gray
Write-Host ""
Write-Host "3. Get Single Course:" -ForegroundColor Yellow
Write-Host '   { course(id: "YOUR_COURSE_ID") { id title description price } }' -ForegroundColor Gray
Write-Host ""
Write-Host "Copy these into graphql-test.html to test!" -ForegroundColor Green
Write-Host ""

