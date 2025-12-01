# Quick Firebase Setup for GraphQL

## Step 1: Download Service Account Key

1. **Go to Service Accounts page:**
   https://console.firebase.google.com/project/microservice-e-learning/settings/serviceaccounts/adminsdk

2. **Click "Generate new private key"**

3. **Save the JSON file** as `firebase-service-account.json`

4. **Place it in:** `cours-service/firebase-service-account.json`

## Step 2: Restart Service

Run: `.\setup-firebase-and-test.ps1`

## That's it! GraphQL will now read from Firestore.

