# GraphQL Test Queries for Courses

## Endpoint
**http://localhost:8081/graphql**

## Test Queries

### 1. Get All Courses (Simple)
```graphql
{
  courses {
    id
    title
    description
    price
  }
}
```

### 2. Get All Courses (Detailed)
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
      email
    }
    youtubeVideoId
    price
    createdAt
  }
}
```

### 3. Get Single Course by ID
```graphql
{
  course(id: "YOUR_COURSE_ID") {
    id
    title
    description
    price
    category {
      id
      name
    }
    professor {
      id
      fullName
    }
    createdAt
  }
}
```

## How to Test

1. **Open graphql-test.html** in your browser
2. **Copy any query above** and paste into the query field
3. **Click "Execute Query"**
4. **View results** in the response section

## Why Courses Might Be Empty

If you see `"courses": []`, it means:
- Firebase credentials are not configured in cours-service
- GraphQL can't read from Firestore

## To Fix (Configure Firebase)

1. **Download Firebase Service Account Key:**
   - Go to: https://console.firebase.google.com/project/microservice-e-learning/settings/serviceaccounts/adminsdk
   - Click "Generate new private key"
   - Save as `firebase-service-account.json`

2. **Place file in cours-service directory:**
   ```
   cours-service/firebase-service-account.json
   ```

3. **Update cours-service/src/main/resources/application.yml:**
   ```yaml
   firebase:
     credentials:
       path: firebase-service-account.json
     project-id: microservice-e-learning
   ```

4. **Restart cours-service**

After this, GraphQL will read courses from Firestore!

