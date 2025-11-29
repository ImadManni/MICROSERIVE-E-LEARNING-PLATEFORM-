# Firebase Error Fix Guide

## Errors Fixed

### 1. "Installations: Create Installation request failed"
**Cause**: Analytics initialization issue  
**Fix**: Removed Analytics initialization (optional feature)

### 2. "Missing or insufficient permissions"
**Cause**: Firestore security rules blocking access  
**Fix**: Need to update Firestore security rules

## Step 1: Update Firestore Security Rules

1. **Go to Firestore Rules**: https://console.firebase.google.com/u/0/project/microservice-e-learning/firestore/databases/-default-/rules

2. **Replace with these rules** (for development):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own student document
    match /students/{studentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == studentId;
      allow update: if request.auth != null && request.auth.uid == studentId;
    }
    
    // Allow authenticated users to manage enrollments
    match /enrollments/{enrollmentId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow anyone to read courses, authenticated users to write
    match /courses/{courseId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

## Step 2: Verify Firebase Setup

### Check Authentication is Enabled
1. Go to: https://console.firebase.google.com/u/0/project/microservice-e-learning/authentication/providers
2. Make sure **Google** provider is **Enabled**

### Check Firestore Database Exists
1. Go to: https://console.firebase.google.com/u/0/project/microservice-e-learning/firestore/databases/-default-/data
2. If database doesn't exist, create it in **test mode**

### Check Authorized Domains
1. Go to: https://console.firebase.google.com/u/0/project/microservice-e-learning/authentication/settings
2. Make sure `localhost` is in authorized domains

## Step 3: Test the Integration

1. **Start your dev server**:
   ```bash
   pnpm dev
   ```

2. **Go to login page**: http://localhost:3000/login

3. **Click "Continue with Google"**

4. **Check browser console** for any errors

5. **Check Firestore**: https://console.firebase.google.com/u/0/project/microservice-e-learning/firestore/databases/-default-/data
   - You should see a new document in `students` collection

## Troubleshooting

### Still getting "permission denied"?
- Make sure you're signed in with Google
- Check Firestore rules are published
- Verify the rules allow `create` for authenticated users

### Still getting initialization errors?
- Clear browser cache
- Restart dev server
- Check browser console for specific error messages

### Analytics errors?
- These are now ignored (Analytics is optional)
- The app will work without Analytics

## Quick Test Rules (Temporary - Development Only)

If you want to test quickly, use these **temporary** rules (NOT for production):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**⚠️ WARNING**: These rules allow any authenticated user to read/write everything. Only use for development!

