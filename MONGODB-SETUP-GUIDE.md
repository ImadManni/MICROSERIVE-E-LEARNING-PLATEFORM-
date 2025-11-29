# MongoDB Setup Guide - Replacing MySQL

## Step 1: Complete MongoDB Atlas Project Setup

### 1.1 Project Configuration
- **Project Name:** `MICROSERVICE E-LEARNING` ✓ (Already set)
- **Tags:** Optional, you can skip for now
- Click **"Create Project"** or **"Next"** to continue

### 1.2 Create a Cluster
After creating the project:
1. Click **"Build a Database"** or **"Create Cluster"**
2. Choose **FREE (M0) tier** (for development)
3. Select **Cloud Provider & Region:**
   - Provider: AWS (or your preference)
   - Region: Choose closest to you (e.g., `eu-west-1` for Europe)
4. Click **"Create Cluster"** (takes 1-3 minutes)

### 1.3 Database Access (Security)
1. Go to **"Database Access"** in the left menu
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Set credentials:
   - **Username:** `learnhub_admin` (or your choice)
   - **Password:** Generate a secure password (save it!)
5. Set **Database User Privileges:** `Atlas admin` (for full access)
6. Click **"Add User"**

### 1.4 Network Access (Whitelist)
1. Go to **"Network Access"** in the left menu
2. Click **"Add IP Address"**
3. For development, click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ **Warning:** Only for development! Use specific IPs in production
4. Click **"Confirm"**

### 1.5 Get Connection String
1. Go to **"Database"** → Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Select **Driver:** `Java` and **Version:** `4.11` or latest
4. Copy the connection string, it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` and `<password>` with your database user credentials
6. **Save this connection string!** You'll need it for configuration

### 1.6 Create Databases
MongoDB creates databases automatically when you first write to them, but you can also create them manually:

**Option A: Via MongoDB Compass (GUI)**
1. Download MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Connect using your connection string
3. Create databases: `cours_db`, `inscription_db`, `statistique_db`

**Option B: Via MongoDB Shell (mongosh)**
```javascript
use cours_db
use inscription_db
use statistique_db
```

**Option C: Automatic (Recommended)**
The Spring Boot applications will create databases automatically when they start.

## Step 2: Local MongoDB (Alternative)

If you prefer local MongoDB instead of Atlas:

### 2.1 Install MongoDB Community Server
1. Download: https://www.mongodb.com/try/download/community
2. Install MongoDB Community Server
3. Start MongoDB service:
   ```powershell
   Start-Service MongoDB
   ```

### 2.2 Local Connection String
```
mongodb://localhost:27017/cours_db
mongodb://localhost:27017/inscription_db
mongodb://localhost:27017/statistique_db
```

## Step 3: Environment Variables

Create or update your `.env` file with MongoDB connection:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://learnhub_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE_COURS=cours_db
MONGODB_DATABASE_INSCRIPTION=inscription_db
MONGODB_DATABASE_STATISTIQUE=statistique_db

# Or for local MongoDB:
# MONGODB_URI=mongodb://localhost:27017
```

## Step 4: What Will Be Changed

The following will be updated in the codebase:
- ✅ Replace MySQL dependencies with MongoDB
- ✅ Convert JPA entities to MongoDB documents
- ✅ Update repositories to use Spring Data MongoDB
- ✅ Update application.yml files
- ✅ Remove Hibernate/JPA configurations
- ✅ Add MongoDB connection configurations

## Next Steps

After completing MongoDB Atlas setup:
1. Share your MongoDB connection string (with credentials)
2. I'll update all backend services to use MongoDB
3. Restart all services

