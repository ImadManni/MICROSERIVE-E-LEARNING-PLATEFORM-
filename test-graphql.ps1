$baseUrl = "http://localhost:8081/graphql"

Write-Host "=== GraphQL Endpoint Test ===" -ForegroundColor Cyan
Write-Host "Endpoint: $baseUrl" -ForegroundColor Yellow
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
    youtubeVideoId
    price
    createdAt
    lessons {
      id
      title
      duration
    }
  }
}
"@

$testMutation = @"
mutation {
  createCourse(input: {
    title: "Test Course from GraphQL"
    description: "This is a test course created via GraphQL"
    categoryId: "1"
    professorId: "1"
    youtubeVideoId: "dQw4w9WgXcQ"
    price: 99.99
  }) {
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
    }
    price
  }
}
"@

Write-Host "1. Testing Query (Get All Courses)..." -ForegroundColor Green
try {
    $queryBody = @{
        query = $testQuery
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $queryBody -ContentType "application/json" -ErrorAction Stop
    
    Write-Host "✅ Query Success!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ Query Failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "2. Testing Query (Get Single Course)..." -ForegroundColor Green
try {
    $singleQuery = @"
{
  course(id: "1") {
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

    $queryBody = @{
        query = $singleQuery
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $queryBody -ContentType "application/json" -ErrorAction Stop
    
    Write-Host "✅ Query Success!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ Query Failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "3. Testing Mutation (Create Course)..." -ForegroundColor Green
Write-Host "Note: This requires valid categoryId and professorId" -ForegroundColor Yellow
try {
    $mutationBody = @{
        query = $testMutation
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $mutationBody -ContentType "application/json" -ErrorAction Stop
    
    Write-Host "✅ Mutation Success!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ Mutation Failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=== Test Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "To test manually, use:" -ForegroundColor Yellow
Write-Host "  curl -X POST http://localhost:8081/graphql -H 'Content-Type: application/json' -d '{\"query\":\"{ courses { id title } }\"}'" -ForegroundColor White
Write-Host ""
Write-Host "Or use GraphQL Playground at: http://localhost:8081/graphql" -ForegroundColor Yellow

