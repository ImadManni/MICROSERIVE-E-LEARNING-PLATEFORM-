# Firebase Frontend Integration - Quick Setup Guide

## Your Firebase Project
- **Project Name**: `microservice-e-learning`
- **Project ID**: `microservice-e-learning`
- **Console**: https://console.firebase.google.com/u/0/project/microservice-e-learning/overview

## Step 1: Get Firebase Configuration

1. Go to: https://console.firebase.google.com/u/0/project/microservice-e-learning/settings/general
2. Scroll down to **"Your apps"** section
3. If you don't have a web app yet:
   - Click the **Web icon** (`</>`)
   - Register app name: `LearnHub Web`
   - Click **"Register app"**
4. Copy the Firebase configuration object

## Step 2: Enable Google Authentication

1. Go to: https://console.firebase.google.com/u/0/project/microservice-e-learning/authentication/providers
2. Click on **"Google"** provider
3. Enable it
4. Add your project support email
5. Click **"Save"**

## Step 3: Create Firestore Database

1. Go to: https://console.firebase.google.com/u/0/project/microservice-e-learning/firestore/databases/-default-/data
2. If database doesn't exist, click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select location (choose closest to you)
5. Click **"Enable"**

## Step 4: Set Firestore Security Rules

1. Go to: https://console.firebase.google.com/u/0/project/microservice-e-learning/firestore/databases/-default-/rules
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /students/{studentId} {
      allow read, write: if request.auth != null && request.auth.uid == studentId;
      allow create: if request.auth != null;
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

3. Click **"Publish"**

## Step 5: Configure Authorized Domains

1. Go to: https://console.firebase.google.com/u/0/project/microservice-e-learning/authentication/settings
2. Scroll to **"Authorized domains"**
3. Make sure `localhost` is listed (it should be by default)
4. Add your production domain when ready

## Step 6: Create .env.local File

Create `.env.local` in the root of your project with your Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_from_firebase_console
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=microservice-e-learning.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=microservice-e-learning
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=microservice-e-learning.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_from_firebase_console
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_from_firebase_console

NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Step 7: Install Firebase Package

```bash
pnpm install
```

## Step 8: Test the Integration

1. Start your Next.js dev server: `pnpm dev`
2. Go to `http://localhost:3000/login`
3. Click **"Continue with Google"**
4. Sign in with your Google account
5. Check Firestore: https://console.firebase.google.com/u/0/project/microservice-e-learning/firestore/databases/-default-/data
6. You should see a new document in the `students` collection!

## How It Works

1. User clicks "Continue with Google"
2. Firebase Auth handles Google OAuth
3. User is authenticated with Firebase
4. User data is automatically saved to Firestore `students` collection
5. User is redirected to dashboard

## Important Links

- **Firebase Console**: https://console.firebase.google.com/u/0/project/microservice-e-learning/overview
- **Authentication**: https://console.firebase.google.com/u/0/project/microservice-e-learning/authentication/users
- **Firestore Data**: https://console.firebase.google.com/u/0/project/microservice-e-learning/firestore/databases/-default-/data
- **Project Settings**: https://console.firebase.google.com/u/0/project/microservice-e-learning/settings/general

