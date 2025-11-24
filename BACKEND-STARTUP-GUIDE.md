# Backend Services - Manual Startup Guide

## Prerequisites Checklist

Before starting, ensure:
- ✅ **MySQL is running** (default port 3306)
- ✅ **JDK 17+ is installed** and `JAVA_HOME` is set
- ✅ **Maven is installed** and in PATH
- ✅ **Environment variables** are set (see below)

## Environment Variables Setup

### For Windows CMD:
```cmd
set JAVA_HOME=C:\Program Files\Java\jdk-17
set JWT_SECRET=mySecretKeyForJWTTokenGeneration123456789
set YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY_HERE
set GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
set GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
```

### For Windows PowerShell:
```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:JWT_SECRET = "mySecretKeyForJWTTokenGeneration123456789"
$env:YOUTUBE_API_KEY = "YOUR_YOUTUBE_API_KEY_HERE"
$env:GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID"
$env:GOOGLE_CLIENT_SECRET = "YOUR_GOOGLE_CLIENT_SECRET"
```

---

## Step-by-Step Manual Startup

### **Step 1: Start Eureka Server (Port 8761)**

**Open a NEW CMD/PowerShell window:**

```cmd
cd "C:\Users\DELL\Desktop\MICROSERVICE E-LEARNING\eureka-server"
set JAVA_HOME=C:\Program Files\Java\jdk-17
mvn spring-boot:run
```

**Wait for:** "Started EurekaServerApplication" message (takes ~15-20 seconds)

**Verify:** Open http://localhost:8761 in browser - you should see Eureka Dashboard

---

### **Step 2: Start Config Server (Port 8888)**

**Open a NEW CMD/PowerShell window:**

```cmd
cd "C:\Users\DELL\Desktop\MICROSERVICE E-LEARNING\config-server"
set JAVA_HOME=C:\Program Files\Java\jdk-17
mvn spring-boot:run
```

**Wait for:** "Started ConfigServerApplication" message (takes ~10-15 seconds)

**Note:** Config Server may show warnings about missing git repo - this is OK, it will use native config.

---

### **Step 3: Start Gateway Service (Port 8080)**

**Open a NEW CMD/PowerShell window:**

```cmd
cd "C:\Users\DELL\Desktop\MICROSERVICE E-LEARNING\gateway-service"
set JAVA_HOME=C:\Program Files\Java\jdk-17
set JWT_SECRET=mySecretKeyForJWTTokenGeneration123456789
mvn spring-boot:run
```

**Wait for:** "Started GatewayServiceApplication" message (takes ~20-30 seconds)

**Verify:** 
- Check Eureka Dashboard (http://localhost:8761) - Gateway should appear
- Test: http://localhost:8080 (should respond, even if 404)

---

### **Step 4: Start Cours Service (Port 8081)**

**Open a NEW CMD/PowerShell window:**

```cmd
cd "C:\Users\DELL\Desktop\MICROSERVICE E-LEARNING\cours-service"
set JAVA_HOME=C:\Program Files\Java\jdk-17
set JWT_SECRET=mySecretKeyForJWTTokenGeneration123456789
mvn spring-boot:run
```

**Wait for:** "Started CoursServiceApplication" message (takes ~20-30 seconds)

**Verify:** Check Eureka Dashboard - Cours Service should appear

---

### **Step 5: Start Inscription Service (Port 8082) - OAuth2 Service**

**Open a NEW CMD/PowerShell window:**

```cmd
cd "C:\Users\DELL\Desktop\MICROSERVICE E-LEARNING\inscription-service"
set JAVA_HOME=C:\Program Files\Java\jdk-17
set JWT_SECRET=mySecretKeyForJWTTokenGeneration123456789
set GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
set GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
mvn spring-boot:run
```

**Wait for:** "Started InscriptionServiceApplication" message (takes ~20-30 seconds)

**Important:** This service handles OAuth2 authentication. Make sure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set!

**Verify:** 
- Check Eureka Dashboard - Inscription Service should appear
- Test OAuth2: http://localhost:8080/oauth2/authorization/google

---

### **Step 6: Start Statistique Service (Port 8083)**

**Open a NEW CMD/PowerShell window:**

```cmd
cd "C:\Users\DELL\Desktop\MICROSERVICE E-LEARNING\statistique-service"
set JAVA_HOME=C:\Program Files\Java\jdk-17
set YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY_HERE
mvn spring-boot:run
```

**Wait for:** "Started StatistiqueServiceApplication" message (takes ~20-30 seconds)

**Verify:** Check Eureka Dashboard - Statistique Service should appear

---

## Verification Checklist

After all services are started, verify:

1. **Eureka Dashboard** (http://localhost:8761)
   - Should show 5 services registered:
     - CONFIG-SERVER
     - GATEWAY-SERVICE
     - COURS-SERVICE
     - INSCRIPTION-SERVICE
     - STATISTIQUE-SERVICE

2. **Gateway Health** (http://localhost:8080)
   - Should respond (404 is OK, means gateway is running)

3. **OAuth2 Endpoint** (http://localhost:8080/oauth2/authorization/google)
   - Should redirect to Google Login page
   - If it doesn't work, check:
     - Inscription Service is running
     - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set
     - Google OAuth credentials are configured correctly

---

## Common Errors and Solutions

### Error: "JAVA_HOME is not defined"
**Solution:** Set JAVA_HOME in each window:
```cmd
set JAVA_HOME=C:\Program Files\Java\jdk-17
```

### Error: "Connection refused" to MySQL
**Solution:** 
- Start MySQL service
- Verify MySQL is running on port 3306
- Check username/password in application.yml (default: root/root)

### Error: "Cannot connect to Eureka"
**Solution:**
- Make sure Eureka Server (Step 1) is fully started before starting other services
- Wait at least 15 seconds after Eureka starts

### Error: "OAuth2 redirect_uri_mismatch"
**Solution:**
- In Google Cloud Console, add these Authorized redirect URIs:
  - `http://localhost:8080/login/oauth2/code/google`
  - `http://localhost:8082/login/oauth2/code/google`
- Wait 5 minutes for changes to propagate

### Error: "Service not found in Eureka"
**Solution:**
- Check Eureka Dashboard to see which services are registered
- Restart the service that's missing
- Make sure Config Server is running (services depend on it)

---

## Testing OAuth2 Flow

1. **Start all services** (Steps 1-6 above)

2. **Verify services are running:**
   - Eureka Dashboard: http://localhost:8761
   - All 5 services should be visible

3. **Test OAuth2:**
   - Open browser: http://localhost:8080/oauth2/authorization/google
   - Should redirect to Google Login
   - After login, should redirect to: http://localhost:3000/auth/callback?token=...&email=...&name=...&id=...
   - Frontend will extract the token and store it

4. **If OAuth2 doesn't work:**
   - Check Inscription Service logs for errors
   - Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct
   - Check Google Cloud Console OAuth2 settings
   - Verify redirect URI matches exactly: `http://localhost:8080/login/oauth2/code/google`
   - Make sure frontend callback page exists at `/auth/callback`

## Fixed Issues

✅ **OAuth2 Route in Gateway:** Added `/oauth2/**` route to gateway routing
✅ **JWT Filter:** Updated to allow OAuth2 paths without authentication
✅ **OAuth2 Success Handler:** Created custom handler to generate JWT token after Google login
✅ **Student Entity:** Made passwordHash nullable for OAuth2 users
✅ **Security Config:** Added OAuth2 paths to permitAll() and configured success handler

---

## Quick Reference - All Commands in One Place

```cmd
REM Terminal 1 - Eureka
cd "C:\Users\DELL\Desktop\MICROSERVICE E-LEARNING\eureka-server"
set JAVA_HOME=C:\Program Files\Java\jdk-17
mvn spring-boot:run

REM Terminal 2 - Config Server (wait 15 sec after Eureka)
cd "C:\Users\DELL\Desktop\MICROSERVICE E-LEARNING\config-server"
set JAVA_HOME=C:\Program Files\Java\jdk-17
mvn spring-boot:run

REM Terminal 3 - Gateway (wait 10 sec after Config Server)
cd "C:\Users\DELL\Desktop\MICROSERVICE E-LEARNING\gateway-service"
set JAVA_HOME=C:\Program Files\Java\jdk-17
set JWT_SECRET=mySecretKeyForJWTTokenGeneration123456789
mvn spring-boot:run

REM Terminal 4 - Cours Service
cd "C:\Users\DELL\Desktop\MICROSERVICE E-LEARNING\cours-service"
set JAVA_HOME=C:\Program Files\Java\jdk-17
set JWT_SECRET=mySecretKeyForJWTTokenGeneration123456789
mvn spring-boot:run

REM Terminal 5 - Inscription Service (OAuth2)
cd "C:\Users\DELL\Desktop\MICROSERVICE E-LEARNING\inscription-service"
set JAVA_HOME=C:\Program Files\Java\jdk-17
set JWT_SECRET=mySecretKeyForJWTTokenGeneration123456789
set GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
set GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
mvn spring-boot:run

REM Terminal 6 - Statistique Service
cd "C:\Users\DELL\Desktop\MICROSERVICE E-LEARNING\statistique-service"
set JAVA_HOME=C:\Program Files\Java\jdk-17
set YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY_HERE
mvn spring-boot:run
```

---

## Service Ports Reference

- **Eureka Server:** 8761
- **Config Server:** 8888
- **Gateway Service:** 8080
- **Cours Service:** 8081
- **Inscription Service:** 8082
- **Statistique Service:** 8083

---

## Stopping Services

To stop all services:
1. Go to each terminal window
2. Press `Ctrl + C` to stop the service
3. Wait for graceful shutdown

---

## Troubleshooting

If a service fails to start:
1. Check the error logs in that service's terminal
2. Verify prerequisites (MySQL, JAVA_HOME, etc.)
3. Check if the port is already in use
4. Verify Eureka is running (for services 3-6)
5. Check database connection (for services 4-6)

