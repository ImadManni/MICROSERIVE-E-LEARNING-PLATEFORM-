Write-Host "=== Fixing IDE Red Errors ===" -ForegroundColor Cyan
Write-Host ""

$javaHome = "C:\Program Files\Java\jdk-17"
if (Test-Path $javaHome) {
    $env:JAVA_HOME = $javaHome
    Write-Host "✅ JAVA_HOME set to: $javaHome" -ForegroundColor Green
} else {
    Write-Host "⚠️  JAVA_HOME not found at: $javaHome" -ForegroundColor Yellow
    Write-Host "Please set JAVA_HOME manually" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Refreshing Maven projects..." -ForegroundColor Cyan
Write-Host ""

$services = @("cours-service", "inscription-service")

foreach ($service in $services) {
    Write-Host "Processing $service..." -ForegroundColor Yellow
    
    if (Test-Path $service) {
        Push-Location $service
        
        if (Test-Path "pom.xml") {
            Write-Host "  - Cleaning project..." -ForegroundColor Gray
            mvn clean -q 2>&1 | Out-Null
            
            Write-Host "  - Downloading dependencies..." -ForegroundColor Gray
            mvn dependency:resolve -q 2>&1 | Out-Null
            
            Write-Host "  - Compiling project..." -ForegroundColor Gray
            mvn compile -q 2>&1 | Out-Null
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  ✅ $service compiled successfully" -ForegroundColor Green
            } else {
                Write-Host "  ⚠️  $service had compilation warnings" -ForegroundColor Yellow
            }
        } else {
            Write-Host "  ❌ pom.xml not found in $service" -ForegroundColor Red
        }
        
        Pop-Location
    } else {
        Write-Host "  ❌ Directory $service not found" -ForegroundColor Red
    }
    
    Write-Host ""
}

Write-Host "=== IDE Refresh Instructions ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "For IntelliJ IDEA:" -ForegroundColor Yellow
Write-Host "  1. Right-click on project root" -ForegroundColor White
Write-Host "  2. Select 'Maven' → 'Reload Project'" -ForegroundColor White
Write-Host "  3. Or: File → Invalidate Caches → Invalidate and Restart" -ForegroundColor White
Write-Host ""
Write-Host "For Eclipse:" -ForegroundColor Yellow
Write-Host "  1. Right-click on project root" -ForegroundColor White
Write-Host "  2. Select 'Maven' → 'Update Project...'" -ForegroundColor White
Write-Host "  3. Check 'Force Update of Snapshots/Releases'" -ForegroundColor White
Write-Host "  4. Click 'OK'" -ForegroundColor White
Write-Host ""
Write-Host "For VS Code:" -ForegroundColor Yellow
Write-Host "  1. Open Command Palette (Ctrl+Shift+P)" -ForegroundColor White
Write-Host "  2. Type 'Java: Clean Java Language Server Workspace'" -ForegroundColor White
Write-Host "  3. Restart VS Code" -ForegroundColor White
Write-Host ""
Write-Host "✅ Done!" -ForegroundColor Green

