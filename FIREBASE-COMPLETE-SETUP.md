# Complete Firebase Setup Guide - Get OAuth & Firestore Working

## 🎯 Your Goal
- Enable Google OAuth login
- Save users to Firestore when they sign in
- View connected users in Firestore console

---

## Step 1: Enable Google Authentication Provider

1. **Go to Authentication Providers**:
   https://console.firebase.google.com/u/0/project/microservice-e-learning/authentication/providers

2. **Click on "Google"** provider

3. **Enable it**:
   - Toggle "Enable" to ON
   - Add your project support email (your email)
   - Click **"Save"**

✅ **Done!** Google OAuth is now enabled.

---

## Step 2: Create Firestore Database (If Not Exists)

1. **Go to Firestore Database**:
   https://console.firebase.google.com/u/0/project/microservice-e-learning/firestore/databases/-default-/data

2. **If you see "Create database" button**:
   - Click **"Create database"**
   - Choose **"Start in test mode"** (for development)
   - Select a location (choose closest to you)
   - Click **"Enable"**

3. **Wait for database to be created** (takes a few seconds)

✅ **Done!** Firestore database is ready.

---

## Step 3: Set Firestore Security Rules (IMPORTANT!)

1. **Go to Firestore Rules**:
   https://console.firebase.google.com/u/0/project/microservice-e-learning/firestore/databases/-default-/rules

2. **Replace ALL the existing rules** with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Students collection - users can create/read their own document
    match /students/{studentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == studentId;
      allow update: if request.auth != null && request.auth.uid == studentId;
    }
    
    // Enrollments collection
    match /enrollments/{enrollmentId} {
      allow read, write: if request.auth != null;
    }
    
    // Courses collection
    match /courses/{courseId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. **Click "Publish"** button (top right)

✅ **Done!** Security rules are set.

---

## Step 4: Verify Authorized Domains

1. **Go to Authentication Settings**:
   https://console.firebase.google.com/u/0/project/microservice-e-learning/authentication/settings

2. **Scroll to "Authorized domains"** section

3. **Make sure `localhost` is listed** (it should be by default)

✅ **Done!** Your localhost is authorized.

---

## Step 5: Install Dependencies & Start App

1. **Open terminal in your project folder**

2. **Install Firebase package**:
   ```bash
   pnpm install
   ```

3. **Start the development server**:
   ```bash
   pnpm dev
   ```

4. **Wait for server to start** (you'll see "Ready" message)

✅ **Done!** App is running at http://localhost:3000

---

## Step 6: Test Google OAuth Login

1. **Open browser**: http://localhost:3000/login

2. **Click "Continue with Google"** button

3. **Sign in with your Google account**

4. **Allow permissions** when prompted

5. **You should be redirected to dashboard**

✅ **Done!** You're logged in!

---

## Step 7: View Connected Users in Firestore

1. **Go to Firestore Data**:
   https://console.firebase.google.com/u/0/project/microservice-e-learning/firestore/databases/-default-/data

2. **Look for `students` collection** (left sidebar)

3. **Click on `students`** to expand it

4. **You'll see documents** - each document is a user who logged in!

5. **Click on a document** to see user details:
   - `id`: User's Firebase UID
   - `email`: User's email address
   - `fullName`: User's display name
   - `roles`: User roles (usually `["ROLE_STUDENT"]`)
   - `createdAt`: When they first signed in

✅ **Done!** You can see all connected users!

---

## 📊 Quick Links

- **Firebase Console**: https://console.firebase.google.com/u/0/project/microservice-e-learning/overview
- **Authentication Users**: https://console.firebase.google.com/u/0/project/microservice-e-learning/authentication/users
- **Firestore Data**: https://console.firebase.google.com/u/0/project/microservice-e-learning/firestore/databases/-default-/data
- **Firestore Rules**: https://console.firebase.google.com/u/0/project/microservice-e-learning/firestore/databases/-default-/rules

---

## ✅ Checklist

Before testing, make sure:

- [ ] Google Authentication is enabled
- [ ] Firestore database is created
- [ ] Firestore security rules are published
- [ ] `localhost` is in authorized domains
- [ ] Dependencies are installed (`pnpm install`)
- [ ] Dev server is running (`pnpm dev`)

---

## 🐛 Troubleshooting

### "Permission denied" error?
- Check Firestore rules are published
- Make sure you're signed in with Google
- Verify rules allow `create` for authenticated users

### "Google sign-in not working"?
- Check Google provider is enabled
- Verify `localhost` is authorized
- Check browser console for errors

### "No users showing in Firestore"?
- Make sure you completed the login process
- Check browser console for errors
- Verify Firestore rules allow `create`

---

## 🎉 Success!

When everything works:
- Users can sign in with Google
- User data is saved to Firestore `students` collection
- You can see all connected users in Firestore console
- Each login creates/updates a user document

