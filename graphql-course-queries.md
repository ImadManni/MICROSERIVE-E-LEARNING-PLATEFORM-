# GraphQL Course Queries - Test Examples

## Endpoint
**URL:** `http://localhost:8081/graphql`  
**Method:** POST  
**Content-Type:** `application/json`

---

## 1. Query: Get All Courses (Simple)

```json
{
  "query": "{ courses { id title description } }"
}
```

**Response fields:** id, title, description

---

## 2. Query: Get All Courses (Detailed)

```json
{
  "query": "{ courses { id title description category { id name } professor { id fullName email } youtubeVideoId price createdAt } }"
}
```

**Response fields:** All course details with nested category and professor

---

## 3. Query: Get Single Course by ID

```json
{
  "query": "{ course(id: \"1\") { id title description category { id name description } professor { id fullName email bio } price youtubeVideoId createdAt lessons { id title duration } } }"
}
```

**Note:** Replace `"1"` with an actual course ID from your database

---

## 4. Mutation: Create Course - Spring Boot

```json
{
  "query": "mutation { createCourse(input: { title: \"Introduction to Spring Boot\" description: \"Learn Spring Boot framework from scratch. Build REST APIs, work with databases, and implement security.\" categoryId: \"1\" professorId: \"1\" youtubeVideoId: \"dQw4w9WgXcQ\" price: 99.99 }) { id title description price category { name } professor { fullName } } }"
}
```

---

## 5. Mutation: Create Course - React Native

```json
{
  "query": "mutation { createCourse(input: { title: \"React Native Mobile Development\" description: \"Build cross-platform mobile apps with React Native. Learn components, navigation, and state management.\" categoryId: \"1\" professorId: \"1\" youtubeVideoId: \"f8Z9JyB2EIE\" price: 149.99 }) { id title description price } }"
}
```

---

## 6. Mutation: Create Course - GraphQL API

```json
{
  "query": "mutation { createCourse(input: { title: \"GraphQL API Development\" description: \"Master GraphQL queries, mutations, and subscriptions. Build efficient APIs with GraphQL.\" categoryId: \"1\" professorId: \"1\" youtubeVideoId: \"ed8SzALpx1Q\" price: 129.99 }) { id title description price } }"
}
```

---

## 7. Mutation: Create Course - Microservices Architecture

```json
{
  "query": "mutation { createCourse(input: { title: \"Microservices Architecture\" description: \"Learn to design and implement microservices with Spring Boot, Eureka, and API Gateway.\" categoryId: \"1\" professorId: \"1\" youtubeVideoId: \"Yy8OTUY8STk\" price: 199.99 }) { id title description price category { name } professor { fullName } } }"
}
```

---

## 8. Mutation: Create Course - Docker & Kubernetes

```json
{
  "query": "mutation { createCourse(input: { title: \"Docker & Kubernetes\" description: \"Containerize applications with Docker and orchestrate with Kubernetes. Learn deployment strategies.\" categoryId: \"1\" professorId: \"1\" youtubeVideoId: \"3c-iBn73dDE\" price: 179.99 }) { id title description price } }"
}
```

---

## 9. Mutation: Create Course - Full Stack Development

```json
{
  "query": "mutation { createCourse(input: { title: \"Full Stack Development\" description: \"Build complete web applications with React, Node.js, and MongoDB. Frontend to backend mastery.\" categoryId: \"1\" professorId: \"1\" youtubeVideoId: \"7t2alJeg2Ik\" price: 249.99 }) { id title description price } }"
}
```

---

## 10. Mutation: Create Course - Firebase Integration

```json
{
  "query": "mutation { createCourse(input: { title: \"Firebase Integration\" description: \"Integrate Firebase Authentication, Firestore, and Cloud Functions in your applications.\" categoryId: \"1\" professorId: \"1\" youtubeVideoId: \"9kRgVxUL16s\" price: 119.99 }) { id title description price } }"
}
```

---

## 11. Query: Get Courses with Lessons

```json
{
  "query": "{ courses { id title description lessons { id title content duration } } }"
}
```

---

## 12. Query: Get Course with All Relations

```json
{
  "query": "{ course(id: \"1\") { id title description category { id name description } professor { id fullName email bio avatarUrl } youtubeVideoId price createdAt lessons { id title content duration } } }"
}
```

---

## Testing Tips

1. **First, create courses** using mutations (queries 4-10)
2. **Then query courses** to see the created data
3. **Use actual IDs** from your database when querying single courses
4. **Check categoryId and professorId** - make sure they exist in your database
5. **YouTube Video IDs** - Use valid YouTube video IDs (11 characters)

---

## Quick Test Sequence

1. **Test Connection:**
   ```json
   { "query": "{ __typename }" }
   ```

2. **Get All Courses (should be empty initially):**
   ```json
   { "query": "{ courses { id title } }" }
   ```

3. **Create a Course:**
   ```json
   { "query": "mutation { createCourse(input: { title: \"Test Course\" description: \"Test\" categoryId: \"1\" professorId: \"1\" price: 99.99 }) { id title } }" }
   ```

4. **Get All Courses Again (should show the created course):**
   ```json
   { "query": "{ courses { id title description price } }" }
   ```

---

## Common Errors & Solutions

- **"Category not found"** → Make sure categoryId exists in your database
- **"Professor not found"** → Make sure professorId exists in your database  
- **"Course not found"** → Use a valid course ID
- **Connection refused** → Make sure cours-service is running on port 8081

