Write-Host "=== GraphQL Endpoint Tester ===" -ForegroundColor Cyan
Write-Host ""

$graphqlUrl = "http://localhost:8081/graphql"
$maxAttempts = 12
$attempt = 0

Write-Host "Waiting for Cours Service (port 8081) to be ready..." -ForegroundColor Yellow
Write-Host ""

while ($attempt -lt $maxAttempts) {
    $attempt++
    Write-Host "Attempt $attempt / $maxAttempts - Checking port 8081" -ForegroundColor Gray -NoNewline
    
    $portOpen = Test-NetConnection -ComputerName localhost -Port 8081 -InformationLevel Quiet -WarningAction SilentlyContinue
    
    if ($portOpen) {
        Write-Host " ✅ Port is open!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Testing GraphQL endpoint..." -ForegroundColor Cyan
        
        Start-Sleep -Seconds 5
        
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

        try {
            $response = Invoke-RestMethod -Uri $graphqlUrl -Method Post -Body $body -ContentType "application/json" -TimeoutSec 10 -ErrorAction Stop
            
            Write-Host ""
            Write-Host "========================================" -ForegroundColor Green
            Write-Host "✅ GraphQL Endpoint is WORKING!" -ForegroundColor Green
            Write-Host "========================================" -ForegroundColor Green
            Write-Host ""
            Write-Host "Endpoint: $graphqlUrl" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "Response:" -ForegroundColor Yellow
            $response | ConvertTo-Json -Depth 10
            
            if ($response.data -and $response.data.courses) {
                $courseCount = $response.data.courses.Count
                Write-Host ""
                Write-Host "✅ Found $courseCount course(s) in database" -ForegroundColor Green
            } elseif ($response.errors) {
                Write-Host ""
                Write-Host "⚠️  GraphQL returned errors:" -ForegroundColor Yellow
                $response.errors | ConvertTo-Json
            } else {
                Write-Host ""
                Write-Host "✅ Query executed successfully (no courses in database yet)" -ForegroundColor Green
            }
            
            Write-Host ""
            Write-Host "========================================" -ForegroundColor Cyan
            Write-Host "Test Queries You Can Try:" -ForegroundColor Cyan
            Write-Host "========================================" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "1. Get all courses:" -ForegroundColor Yellow
            Write-Host '   { courses { id title description } }' -ForegroundColor White
            Write-Host ""
            Write-Host "2. Get single course:" -ForegroundColor Yellow
            Write-Host '   { course(id: "1") { id title category { name } } }' -ForegroundColor White
            Write-Host ""
            Write-Host "3. Create course (mutation):" -ForegroundColor Yellow
            Write-Host '   mutation { createCourse(input: { title: "Test", categoryId: "1", professorId: "1", price: 99.99 }) { id title } }' -ForegroundColor White
            Write-Host ""
            
            exit 0
        } catch {
            Write-Host ""
            Write-Host "⚠️  Port is open but GraphQL not responding yet..." -ForegroundColor Yellow
            Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Gray
            Write-Host ""
            Write-Host "Waiting 10 more seconds..." -ForegroundColor Gray
            Start-Sleep -Seconds 10
        }
    } else {
        Write-Host " ⏳ Not ready yet" -ForegroundColor Yellow
        Start-Sleep -Seconds 10
    }
}

Write-Host ""
Write-Host "❌ Service did not start in time" -ForegroundColor Red
Write-Host ""
Write-Host "Please check:" -ForegroundColor Yellow
Write-Host "  1. Service windows for errors" -ForegroundColor White
Write-Host "  2. MongoDB connection" -ForegroundColor White
Write-Host "  3. Java/Maven installation" -ForegroundColor White
Write-Host ""
Write-Host "You can test manually later with:" -ForegroundColor Cyan
Write-Host "  .\test-graphql.ps1" -ForegroundColor White

