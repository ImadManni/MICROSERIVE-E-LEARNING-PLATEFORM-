# Configure Firebase for GraphQL to Read from Firestore

## Option 1: Use Service Account Key (Recommended)

1. **Download Service Account Key:**
   - Go to: https://console.firebase.google.com/project/microservice-e-learning/settings/serviceaccounts/adminsdk
   - Click "Generate new private key"
   - Save the JSON file (e.g., `firebase-service-account.json`)

2. **Place the file in cours-service directory:**
   ```
   cours-service/firebase-service-account.json
   ```

3. **Update application.yml:**
   ```yaml
   firebase:
     credentials:
       path: firebase-service-account.json
     project-id: microservice-e-learning
   ```

## Option 2: Use Environment Variable

Set environment variable before starting the service:
```powershell
$env:FIREBASE_CREDENTIALS_PATH = "C:\path\to\firebase-service-account.json"
$env:FIREBASE_PROJECT_ID = "microservice-e-learning"
```

## Option 3: Use Default Credentials (if gcloud is configured)

If you have gcloud CLI installed and authenticated:
```powershell
gcloud auth application-default login
```

Then the service will use default credentials automatically.

