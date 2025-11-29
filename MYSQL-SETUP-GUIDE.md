# MySQL Setup Guide

## Problem
If you see errors like:
```
com.mysql.cj.jdbc.exceptions.CommunicationsException: Communications link failure
Connection refused: no further information
```

This means MySQL is not running or not accessible.

## Solution

### Step 1: Check if MySQL is Running

**Windows (PowerShell):**
```powershell
Get-Service -Name MySQL* | Select-Object Name, Status
```

**Windows (Command Prompt):**
```cmd
sc query MySQL80
```

**Alternative check:**
```powershell
Test-NetConnection -ComputerName localhost -Port 3306
```

### Step 2: Start MySQL Service

**Windows (PowerShell as Administrator):**
```powershell
Start-Service MySQL80
```

**Windows (Command Prompt as Administrator):**
```cmd
net start MySQL80
```

**If service name is different:**
- Check services: `services.msc`
- Look for MySQL service (might be named `MySQL`, `MySQL80`, `MySQL57`, etc.)

### Step 3: Verify MySQL Connection

**Using MySQL Command Line:**
```bash
mysql -u root -p
```

Enter password when prompted (default is usually `root` or empty).

**Test connection:**
```sql
SELECT VERSION();
SHOW DATABASES;
```

### Step 4: Create Required Databases

The services will auto-create databases if `createDatabaseIfNotExist=true` is in the connection URL, but you can also create them manually:

```sql
CREATE DATABASE IF NOT EXISTS cours_db;
CREATE DATABASE IF NOT EXISTS inscription_db;
CREATE DATABASE IF NOT EXISTS statistique_db;
```

### Step 5: Verify Database Configuration

The services expect:
- **Host:** `localhost`
- **Port:** `3306`
- **Username:** `root`
- **Password:** `root`
- **Databases:** `cours_db`, `inscription_db`, `statistique_db`

If your MySQL uses different credentials, update the `application.yml` files in each service.

### Step 6: Restart Services

After MySQL is running, restart the backend services:
```powershell
.\start-all-services-clean.ps1
```

## Troubleshooting

### MySQL Not Installed

If MySQL is not installed:
1. Download MySQL from: https://dev.mysql.com/downloads/installer/
2. Install MySQL Server
3. During installation, set root password to `root` (or update config files)
4. Start MySQL service

### Port 3306 Already in Use

If port 3306 is occupied:
```powershell
Get-NetTCPConnection -LocalPort 3306 | Select-Object OwningProcess
```

Then check what process is using it and stop it, or change MySQL port in configuration.

### Wrong Password

If you get authentication errors:
1. Reset MySQL root password
2. Or update `application.yml` files with correct credentials

### MySQL Service Won't Start

1. Check MySQL error logs (usually in `C:\ProgramData\MySQL\MySQL Server X.X\Data\`)
2. Verify MySQL installation
3. Check Windows Event Viewer for MySQL errors

## Quick Start Script

Create a PowerShell script to check and start MySQL:

```powershell
$mysqlService = Get-Service -Name MySQL* -ErrorAction SilentlyContinue

if ($null -eq $mysqlService) {
    Write-Host "MySQL service not found. Please install MySQL first." -ForegroundColor Red
    exit 1
}

if ($mysqlService.Status -ne 'Running') {
    Write-Host "Starting MySQL service..." -ForegroundColor Yellow
    Start-Service -Name $mysqlService.Name
    Start-Sleep -Seconds 3
}

if ((Get-Service -Name $mysqlService.Name).Status -eq 'Running') {
    Write-Host "MySQL is running!" -ForegroundColor Green
} else {
    Write-Host "Failed to start MySQL. Please check manually." -ForegroundColor Red
    exit 1
}
```

