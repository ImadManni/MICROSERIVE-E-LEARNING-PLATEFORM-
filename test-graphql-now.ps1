Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GraphQL Endpoint Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$graphqlUrl = "http://localhost:8081/graphql"
$maxAttempts = 15
$attempt = 0

Write-Host "Waiting for Cours Service to be ready..." -ForegroundColor Yellow
Write-Host ""

while ($attempt -lt $maxAttempts) {
    $attempt++
    
    Write-Host "Attempt $attempt / $maxAttempts - Checking port 8081..." -ForegroundColor Gray -NoNewline
    
    $portOpen = Test-NetConnection -ComputerName localhost -Port 8081 -InformationLevel Quiet -WarningAction SilentlyContinue
    
    if ($portOpen) {
        Write-Host " ✅ Port is open!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Waiting 5 seconds for service to fully initialize..." -ForegroundColor Gray
        Start-Sleep -Seconds 5
        
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "Testing GraphQL Endpoint" -ForegroundColor Cyan
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host ""
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

        Write-Host "Query: Get All Courses" -ForegroundColor Gray
        Write-Host ""
        
        try {
            $response = Invoke-RestMethod -Uri $graphqlUrl -Method Post -Body $body -ContentType "application/json" -TimeoutSec 10 -ErrorAction Stop
            
            Write-Host "========================================" -ForegroundColor Green
            Write-Host "✅ GraphQL Endpoint is WORKING!" -ForegroundColor Green
            Write-Host "========================================" -ForegroundColor Green
            Write-Host ""
            Write-Host "Response:" -ForegroundColor Cyan
            $response | ConvertTo-Json -Depth 10
            Write-Host ""
            
            if ($response.data -and $response.data.courses) {
                $count = $response.data.courses.Count
                Write-Host "✅ Found $count course(s) in database" -ForegroundColor Green
                
                foreach ($course in $response.data.courses) {
                    Write-Host ""
                    Write-Host "Course: $($course.title)" -ForegroundColor Yellow
                    Write-Host "  ID: $($course.id)" -ForegroundColor Gray
                    Write-Host "  Category: $($course.category.name)" -ForegroundColor Gray
                    Write-Host "  Professor: $($course.professor.fullName)" -ForegroundColor Gray
                    Write-Host "  Price: `$$($course.price)" -ForegroundColor Gray
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
            Write-Host "You can now:" -ForegroundColor Yellow
            Write-Host "  1. Test in browser: $graphqlUrl" -ForegroundColor White
            Write-Host "  2. Use Postman or curl to send GraphQL queries" -ForegroundColor White
            Write-Host "  3. Run: .\test-graphql.ps1 (for more tests)" -ForegroundColor White
            Write-Host ""
            
            exit 0
        } catch {
            Write-Host ""
            Write-Host "⚠️ Port is open but GraphQL not responding yet..." -ForegroundColor Yellow
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
Write-Host "  1. Service window for compilation/startup errors" -ForegroundColor White
Write-Host "  2. MongoDB connection" -ForegroundColor White
Write-Host "  3. Java/Maven installation" -ForegroundColor White
Write-Host ""
Write-Host "Once service is running, test with:" -ForegroundColor Cyan
Write-Host "  .\test-graphql.ps1" -ForegroundColor White

