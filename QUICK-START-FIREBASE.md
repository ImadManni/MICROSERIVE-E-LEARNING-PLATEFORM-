# Quick Start - Firebase Integration

## Your Firebase Project
- **Project ID**: `microservice-e-learning`
- **Console**: https://console.firebase.google.com/u/0/project/microservice-e-learning/overview

## Step 1: Get Firebase Configuration

1. **Go to Project Settings**: https://console.firebase.google.com/u/0/project/microservice-e-learning/settings/general
2. Scroll to **"Your apps"** section
3. If no web app exists:
   - Click **Web icon** (`</>`)
   - App nickname: `LearnHub Web`
   - Click **"Register app"**
4. **Copy these values** from the config object:
   - `apiKey`
   - `messagingSenderId`
   - `appId`

## Step 2: Enable Google Authentication

1. **Go to Authentication**: https://console.firebase.google.com/u/0/project/microservice-e-learning/authentication/providers
2. Click **"Google"**
3. **Enable** it
4. Add support email
5. Click **"Save"**

## Step 3: Create Firestore Database

1. **Go to Firestore**: https://console.firebase.google.com/u/0/project/microservice-e-learning/firestore/databases/-default-/data
2. If database doesn't exist:
   - Click **"Create database"**
   - Choose **"Start in test mode"**
   - Select location
   - Click **"Enable"**

## Step 4: Set Firestore Security Rules

1. **Go to Rules**: https://console.firebase.google.com/u/0/project/microservice-e-learning/firestore/databases/-default-/rules
2. **Replace** with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /students/{studentId} {
      allow read, write: if request.auth != null && request.auth.uid == studentId;
      allow create: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

## Step 5: Create .env.local File

Create `.env.local` in project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_from_step_1
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=microservice-e-learning.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=microservice-e-learning
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=microservice-e-learning.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_from_step_1
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_from_step_1

NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Step 6: Install and Run

```bash
pnpm install
pnpm dev
```

## Step 7: Test

1. Go to: http://localhost:3000/login
2. Click **"Continue with Google"**
3. Sign in with Google
4. **Check Firestore**: https://console.firebase.google.com/u/0/project/microservice-e-learning/firestore/databases/-default-/data
5. You should see a new document in `students` collection! 🎉

## All Firebase Console Links

- **Overview**: https://console.firebase.google.com/u/0/project/microservice-e-learning/overview
- **Authentication Users**: https://console.firebase.google.com/u/0/project/microservice-e-learning/authentication/users
- **Authentication Providers**: https://console.firebase.google.com/u/0/project/microservice-e-learning/authentication/providers
- **Firestore Data**: https://console.firebase.google.com/u/0/project/microservice-e-learning/firestore/databases/-default-/data
- **Firestore Rules**: https://console.firebase.google.com/u/0/project/microservice-e-learning/firestore/databases/-default-/rules
- **Project Settings**: https://console.firebase.google.com/u/0/project/microservice-e-learning/settings/general

