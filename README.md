# Online Learning Platform - Microservices Architecture

A comprehensive academic project demonstrating microservices architecture with Spring Boot 3 backend and Next.js frontend, integrated with Firebase for authentication and data storage.

## Architecture

### Backend Services (Spring Boot 3)

1. **Eureka Server** (Port 8761) - Service Discovery
2. **Config Server** (Port 8888) - Centralized Configuration
3. **Gateway Service** (Port 8080) - API Gateway with JWT Authentication
4. **Cours Service** (Port 8081) - Course Management with GraphQL (MySQL)
5. **Inscription Service** (Port 8082) - Student Enrollment with Feign Client (Firebase Firestore)
6. **Statistique Service** (Port 8083) - YouTube Analytics with WebClient (MySQL)

### Frontend (Next.js)

- React + Next.js 16.0.3
- TailwindCSS for styling
- GSAP animations
- Firebase Authentication (Google Sign-In)
- Firebase Firestore for data storage
- Framer Motion for transitions
- JWT & OAuth2 Google Authentication

## Database Architecture

- **MySQL**: Used by `cours-service` and `statistique-service` for course management and statistics
- **Firebase Firestore**: Used by `inscription-service` and frontend for:
  - Student data (`students` collection)
  - Enrollment data (`enrollments` collection)
  - Course data (`courses` collection) - synced from admin panel

## Prerequisites

- JDK 17+
- Node.js 18+
- MySQL 8+ (for cours-service and statistique-service)
- Firebase Project (for authentication and Firestore)
- Maven 3.8+

## Setup Instructions

### Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project: `microservice-e-learning`
   - Enable Google Authentication provider
   - Create Firestore database (start in test mode for development)

2. **Get Firebase Configuration**
   - Project Settings → General → Your apps → Web app
   - Copy Firebase config object
   - Create `.env.local` in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

3. **Configure Firestore Security Rules**
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
         allow read: if request.auth != null;
         allow write: if request.auth != null && request.auth.token.admin == true;
       }
     }
   }
   ```

4. **Generate Service Account Key** (for backend)
   - Project Settings → Service accounts
   - Generate new private key
   - Save JSON file and configure path in `inscription-service/src/main/resources/application.yml`

### Backend Setup

1. **Start MySQL** and create databases:
   ```sql
   CREATE DATABASE cours_db;
   CREATE DATABASE statistique_db;
   ```

2. **Configure Firebase for Inscription Service**
   - Add Firebase service account JSON path to `inscription-service/src/main/resources/application.yml`:
   ```yaml
   firebase:
     credentials-path: path/to/service-account-key.json
     project-id: microservice-e-learning
   ```

3. **Configure environment variables**:
   ```bash
   export JWT_SECRET=mySecretKeyForJWTTokenGeneration123456789
   export YOUTUBE_API_KEY=your_youtube_api_key
   export GOOGLE_CLIENT_ID=your_google_client_id
   export GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Start services in order**:
   ```bash
   # 1. Start Eureka Server
   cd eureka-server
   mvn spring-boot:run

   # 2. Start Config Server
   cd config-server
   mvn spring-boot:run

   # 3. Start Gateway Service
   cd gateway-service
   mvn spring-boot:run

   # 4. Start Microservices
   cd cours-service
   mvn spring-boot:run

   cd inscription-service
   mvn spring-boot:run

   cd statistique-service
   mvn spring-boot:run
   ```

### Frontend Setup

```bash
# Install dependencies
npm install
# or
pnpm install

# Run development server
npm run dev
# or
pnpm dev
```

Access the application at `http://localhost:3000`

## API Endpoints

### Authentication (via Gateway)

- POST `/auth/register` - Register new student
- POST `/auth/login` - Login
- POST `/auth/refresh` - Refresh token

### Courses (via Gateway)

- GET `/api/cours/` - Get all courses (paginated)
- GET `/api/cours/{id}` - Get course by ID
- GET `/api/cours/search?keyword=...` - Search courses
- POST `/api/cours/` - Create course (Protected)
- PUT `/api/cours/{id}` - Update course (Protected)
- DELETE `/api/cours/{id}` - Delete course (Protected)

### GraphQL (Cours Service)

- POST `/graphql` - GraphQL endpoint

### Enrollments (via Gateway)

- POST `/api/inscriptions?studentId=...&courseId=...` - Enroll student
- GET `/api/inscriptions/student/{studentId}` - Get student enrollments
- PUT `/api/inscriptions/{id}/progress?progress=...` - Update progress
- DELETE `/api/inscriptions/{id}` - Unenroll

### Statistics (via Gateway)

- POST `/api/stats/course/{courseId}?youtubeVideoId=...` - Fetch video stats
- GET `/api/stats/course/{courseId}` - Get course statistics
- GET `/api/stats/video/{youtubeId}` - Get video statistics

## Key Features

### Backend

- ✅ Microservices architecture
- ✅ Spring Cloud (Eureka, Config, Gateway)
- ✅ Spring Data REST for automatic CRUD endpoints
- ✅ GraphQL support with Spring for GraphQL
- ✅ Feign Client for inter-service communication
- ✅ WebClient for external API calls (YouTube)
- ✅ JWT authentication with role-based access
- ✅ Firebase Admin SDK for Firestore operations
- ✅ Global exception handling
- ✅ Entity validation
- ✅ MapStruct for DTO mapping
- ✅ SLF4J logging

### Frontend

- ✅ Next.js 16.0.3
- ✅ TailwindCSS styling
- ✅ GSAP animations
- ✅ Firebase Authentication (Google Sign-In)
- ✅ Firebase Firestore for real-time data
- ✅ JWT authentication
- ✅ HTTP interceptors
- ✅ Route guards
- ✅ React Hook Form
- ✅ TypeScript strict mode
- ✅ Admin panel with course management

## Project Structure

```
.
├── config-server/          # Centralized configuration
├── eureka-server/          # Service discovery
├── gateway-service/        # API Gateway
├── cours-service/          # Course management (MySQL)
├── inscription-service/    # Enrollment management (Firebase Firestore)
├── statistique-service/    # YouTube analytics (MySQL)
├── app/                    # Next.js app directory
├── components/             # React components
├── lib/                    # Utilities and Firebase config
│   ├── firebase.ts         # Firebase client SDK
│   ├── firestore-courses.ts # Firestore courses service
│   └── api.ts              # Backend API client
└── contexts/               # React contexts (auth, etc.)
```

## Technologies Used

### Backend

- Spring Boot 3.2.0
- Spring Cloud 2023.0.0
- Spring Data JPA (for MySQL services)
- Spring Data REST
- Spring for GraphQL
- Spring Security
- MySQL (cours-service, statistique-service)
- Firebase Admin SDK 9.2.0 (inscription-service)
- JJWT 0.12.3
- MapStruct 1.5.5
- Lombok

### Frontend

- Next.js 16.0.3
- React 19.2.0
- TypeScript 5
- TailwindCSS 4.1.9
- Firebase 10.14.1 (Authentication & Firestore)
- GSAP (animations)
- Framer Motion (transitions)
- React Hook Form
- Radix UI components
- Lucide React (icons)

## Notes

- This is an academic project for local development only
- No deployment or CI/CD configuration included
- Firebase Authentication requires proper project setup
- YouTube API key required for statistics service
- MySQL databases required for cours-service and statistique-service
- Firebase Firestore used for inscription-service and frontend course management

## License

Academic project - For educational purposes only
