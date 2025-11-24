@echo off
echo ========================================
echo Starting LearnHub Backend Services
echo ========================================
echo.

REM Set JAVA_HOME if not already set
if "%JAVA_HOME%"=="" (
    if exist "C:\Program Files\Java\jdk-17" (
        set "JAVA_HOME=C:\Program Files\Java\jdk-17"
    ) else if exist "C:\Program Files\Java\jdk-21" (
        set "JAVA_HOME=C:\Program Files\Java\jdk-21"
    ) else if exist "C:\Program Files\Java\jdk-11" (
        set "JAVA_HOME=C:\Program Files\Java\jdk-11"
    )
    echo JAVA_HOME set to: %JAVA_HOME%
)

REM Check if Maven is installed
mvn -version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Maven is not installed or not in PATH
    echo Please install Maven and add it to your PATH
    echo Or set JAVA_HOME environment variable
    pause
    exit /b 1
)

echo Step 1/6: Starting Eureka Server (Port 8761)...
echo Opening Eureka Server window...
start "Eureka Server" cmd /k "cd /d %~dp0eureka-server && set JAVA_HOME=%JAVA_HOME% && echo JAVA_HOME=%JAVA_HOME% && echo Starting Eureka Server... && mvn spring-boot:run"
echo Waiting 15 seconds...
timeout /t 15 /nobreak >nul

echo Step 2/6: Starting Config Server (Port 8888)...
echo Opening Config Server window...
start "Config Server" cmd /k "cd /d %~dp0config-server && set JAVA_HOME=%JAVA_HOME% && echo JAVA_HOME=%JAVA_HOME% && echo Starting Config Server... && mvn spring-boot:run"
echo Waiting 10 seconds...
timeout /t 10 /nobreak >nul

echo Step 3/6: Starting Gateway Service (Port 8080)...
echo Opening Gateway Service window...
start "Gateway Service" cmd /k "cd /d %~dp0gateway-service && set JAVA_HOME=%JAVA_HOME% && echo JAVA_HOME=%JAVA_HOME% && echo Starting Gateway Service... && mvn spring-boot:run"
echo Waiting 10 seconds...
timeout /t 10 /nobreak >nul

echo Step 4/6: Starting Cours Service (Port 8081)...
echo Opening Cours Service window...
start "Cours Service" cmd /k "cd /d %~dp0cours-service && set JAVA_HOME=%JAVA_HOME% && echo JAVA_HOME=%JAVA_HOME% && echo Starting Cours Service... && mvn spring-boot:run"
echo Waiting 5 seconds...
timeout /t 5 /nobreak >nul

echo Step 5/6: Starting Inscription Service (Port 8082)...
echo Opening Inscription Service window...
start "Inscription Service" cmd /k "cd /d %~dp0inscription-service && set JAVA_HOME=%JAVA_HOME% && echo JAVA_HOME=%JAVA_HOME% && echo Starting Inscription Service... && mvn spring-boot:run"
echo Waiting 5 seconds...
timeout /t 5 /nobreak >nul

echo Step 6/6: Starting Statistique Service (Port 8083)...
echo Opening Statistique Service window...
start "Statistique Service" cmd /k "cd /d %~dp0statistique-service && set JAVA_HOME=%JAVA_HOME% && echo JAVA_HOME=%JAVA_HOME% && echo Starting Statistique Service... && mvn spring-boot:run"

echo.
echo ========================================
echo All services are starting!
echo ========================================
echo.
echo Service URLs:
echo   - Eureka Dashboard: http://localhost:8761
echo   - Gateway (API): http://localhost:8080
echo   - OAuth2 Login: http://localhost:8080/oauth2/authorization/google
echo.
echo Note: It may take 1-2 minutes for all services to fully start.
echo Check the command windows for startup logs.
echo.
pause

