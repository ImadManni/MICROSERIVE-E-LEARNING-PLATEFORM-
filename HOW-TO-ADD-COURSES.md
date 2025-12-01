# How to Add Courses and See Them in GraphQL

## Overview

Your frontend admin panel saves courses to **Firestore**, and now the GraphQL endpoint reads from **Firestore** too! This means courses you add through the frontend will automatically appear in GraphQL.

## Step-by-Step Guide

### 1. Start All Services

Run all backend services and frontend:

```powershell
# Start backend services
.\start-backend-ps1.ps1

# Or start individually:
# - Eureka Server (port 8761)
# - Config Server (port 8888)  
# - Gateway Service (port 8080)
# - Cours Service (port 8081) - **IMPORTANT for GraphQL**
# - Inscription Service (port 8082)
# - Statistique Service (port 8083)

# Start frontend
npm run dev
# or
pnpm dev
```

### 2. Add Courses via Frontend Admin Panel

1. **Open frontend:** http://localhost:3000
2. **Login** with your Firebase account
3. **Go to Admin Panel:** http://localhost:3000/admin/courses
4. **Click "Add Course"**
5. **Fill in the form:**
   - Title: e.g., "Introduction to Spring Boot"
   - Description: e.g., "Learn Spring Boot framework"
   - Category: Select a category
   - Professor: Select a professor
   - YouTube Video: Search and select a video
   - Price: e.g., 99.99
6. **Click "Create"**

The course is now saved to **Firestore**!

### 3. Test in GraphQL

1. **Open GraphQL test page:** `graphql-test.html` in your browser
2. **Or use the endpoint directly:** http://localhost:8081/graphql

3. **Query to get all courses:**
```graphql
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
    }
    price
    createdAt
  }
}
```

You should now see the courses you added through the admin panel!

## How It Works

1. **Frontend Admin Panel** → Saves courses to **Firestore** (`courses` collection)
2. **GraphQL Endpoint** → Reads courses from **Firestore** (same collection)
3. **Result:** Courses added in frontend appear in GraphQL immediately!

## Architecture

```
Frontend Admin Panel
    ↓ (saves to)
Firestore (courses collection)
    ↑ (reads from)
GraphQL Endpoint (cours-service)
```

## Troubleshooting

### Courses not showing in GraphQL?

1. **Check Firestore:**
   - Go to: https://console.firebase.google.com/project/microservice-e-learning/firestore
   - Verify courses exist in `courses` collection

2. **Check cours-service logs:**
   - Look for Firebase initialization messages
   - Check for any Firestore connection errors

3. **Verify Firebase config:**
   - Check `cours-service/src/main/resources/application.yml`
   - Ensure `firebase.project-id` is set to `microservice-e-learning`
   - If using service account, set `firebase.credentials.path`

4. **Restart cours-service:**
   - The service needs to be restarted after Firebase integration
   - Run: `.\restart-and-open-graphql.ps1`

### Firebase Connection Issues?

If you see Firebase errors in cours-service logs:

1. **Option 1: Use Service Account Key**
   - Download service account JSON from Firebase Console
   - Set path in `application.yml`: `firebase.credentials.path: path/to/key.json`

2. **Option 2: Use Default Credentials**
   - Set `GOOGLE_APPLICATION_CREDENTIALS` environment variable
   - Or use `gcloud auth application-default login`

## Example: Complete Flow

1. **Start services:**
   ```powershell
   .\start-backend-ps1.ps1
   # Wait for all services to start
   ```

2. **Start frontend:**
   ```powershell
   npm run dev
   ```

3. **Add course via admin:**
   - Go to http://localhost:3000/admin/courses
   - Click "Add Course"
   - Fill form and create

4. **Verify in Firestore:**
   - Check Firebase Console
   - Course should be in `courses` collection

5. **Query GraphQL:**
   - Open `graphql-test.html`
   - Run query: `{ courses { id title } }`
   - Course should appear!

## Quick Test Queries

**Get all courses:**
```graphql
{ courses { id title description price } }
```

**Get single course:**
```graphql
{ course(id: "YOUR_COURSE_ID") { id title description } }
```

**Create course via GraphQL (also saves to Firestore if configured):**
```graphql
mutation {
  createCourse(input: {
    title: "Test Course"
    description: "Test Description"
    categoryId: "1"
    professorId: "1"
    price: 99.99
  }) {
    id
    title
  }
}
```

## Summary

✅ **Frontend saves to Firestore**  
✅ **GraphQL reads from Firestore**  
✅ **Courses added in admin panel appear in GraphQL**  
✅ **No MongoDB needed for courses (only for categories/professors if needed)**

