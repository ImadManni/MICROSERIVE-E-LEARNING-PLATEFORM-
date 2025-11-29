# Firebase Integration Guide - Replacing MongoDB

## Required Firebase Links and Resources

### 1. Firebase Console
- **Firebase Console**: https://console.firebase.google.com/
- **Create Project**: https://console.firebase.google.com/project/_/overview
- **Firebase Documentation**: https://firebase.google.com/docs

### 2. Firebase Authentication Setup
- **Firebase Auth Documentation**: https://firebase.google.com/docs/auth
- **Google Sign-In Setup**: https://firebase.google.com/docs/auth/web/google-signin
- **Firebase Auth REST API**: https://firebase.google.com/docs/reference/rest/auth

### 3. Firestore Database (Replaces MongoDB)
- **Firestore Documentation**: https://firebase.google.com/docs/firestore
- **Firestore REST API**: https://firebase.google.com/docs/firestore/reference/rest
- **Firestore Security Rules**: https://firebase.google.com/docs/firestore/security/get-started

### 4. Firebase Admin SDK (For Backend)
- **Firebase Admin SDK Java**: https://firebase.google.com/docs/admin/setup
- **Maven Repository**: https://mvnrepository.com/artifact/com.google.firebase/firebase-admin
- **Admin SDK Documentation**: https://firebase.google.com/docs/admin/setup/java

### 5. Firebase Client SDK (For Frontend)
- **Firebase JS SDK**: https://firebase.google.com/docs/web/setup
- **NPM Package**: https://www.npmjs.com/package/firebase
- **Firebase Auth Web**: https://firebase.google.com/docs/auth/web/start

## Step-by-Step Setup Instructions

### Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `learnhub-elearning` (or your choice)
4. Enable Google Analytics (optional)
5. Click **"Create project"**

### Step 2: Enable Authentication

1. In Firebase Console, go to **"Authentication"** → **"Get started"**
2. Click **"Sign-in method"** tab
3. Enable **"Google"** provider:
   - Click on **"Google"**
   - Enable it
   - Add your project support email
   - Click **"Save"**
4. Copy the **Web API Key** (you'll need this)

### Step 3: Create Firestore Database

1. Go to **"Firestore Database"** in Firebase Console
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a location (choose closest to you)
5. Click **"Enable"**

### Step 4: Get Firebase Configuration

1. Go to **Project Settings** (gear icon) → **"General"** tab
2. Scroll to **"Your apps"** section
3. Click **"Web"** icon (`</>`) to add a web app
4. Register app name: `LearnHub Web`
5. Copy the **Firebase configuration object**:
   ```javascript
   {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   }
   ```

### Step 5: Generate Service Account Key (For Backend)

1. Go to **Project Settings** → **"Service accounts"** tab
2. Click **"Generate new private key"**
3. Download the JSON file (keep it secure!)
4. This file contains credentials for Firebase Admin SDK

### Step 6: Configure Authorized Domains

1. Go to **Authentication** → **Settings** → **Authorized domains**
2. Add your domains:
   - `localhost` (for development)
   - Your production domain (when ready)

## Environment Variables Needed

### Frontend (.env.local)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Backend (application.yml or environment)
```yaml
firebase:
  credentials:
    path: path/to/serviceAccountKey.json
  project-id: your_project_id
```

## Firebase Security Rules (Firestore)

Go to **Firestore Database** → **Rules** tab and set:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /students/{studentId} {
      allow read, write: if request.auth != null;
    }
    match /enrollments/{enrollmentId} {
      allow read, write: if request.auth != null;
    }
    match /courses/{courseId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Next Steps

After completing Firebase setup:
1. Share your Firebase project ID
2. I'll update all backend services to use Firebase
3. Update frontend to use Firebase Auth
4. Remove all MongoDB dependencies

