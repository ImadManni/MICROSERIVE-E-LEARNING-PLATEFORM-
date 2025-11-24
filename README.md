# Online Learning Platform - Microservices Architecture

A comprehensive academic project demonstrating microservices architecture with Spring Boot 3 backend and Angular 17 frontend.

## Architecture

### Backend Services (Spring Boot 3)
1. **Eureka Server** (Port 8761) - Service Discovery
2. **Config Server** (Port 8888) - Centralized Configuration
3. **Gateway Service** (Port 8080) - API Gateway with JWT Authentication
4. **Cours Service** (Port 8081) - Course Management with GraphQL
5. **Inscription Service** (Port 8082) - Student Enrollment with Feign Client
6. **Statistique Service** (Port 8083) - YouTube Analytics with WebClient

### Frontend (NextJs)
- React + Next.js (recommended Next 14)
- TailwindCSS for styling
- GSAP animations
- Apollo GraphQL Client
- Framer Motion for transitions
- JWT & OAuth2 Google Authentication

## Prerequisites

- JDK 17+
- Node.js 18+
- MySQL 8+
- Maven 3.8+

## Setup Instructions

### Backend Setup

1. **Start MySQL** and create databases:
   \`\`\`sql
   CREATE DATABASE cours_db;
   CREATE DATABASE inscription_db;
   CREATE DATABASE statistique_db;
   \`\`\`

2. **Configure environment variables** (optional):
   \`\`\`bash
   export JWT_SECRET=mySecretKeyForJWTTokenGeneration123456789
   export YOUTUBE_API_KEY=your_youtube_api_key
   export GOOGLE_CLIENT_ID=your_google_client_id
   export GOOGLE_CLIENT_SECRET=your_google_client_secret
   \`\`\`

3. **Start services in order**:
   \`\`\`bash
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
   \`\`\`

### Frontend Setup

\`\`\`bash
cd frontend/next-app
npm install
npm start
\`\`\`

Access the application at `http://localhost:4200`

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
- ✅ Global exception handling
- ✅ Entity validation
- ✅ MapStruct for DTO mapping
- ✅ SLF4J logging

### Frontend
- ✅ NextJs
- ✅ TailwindCSS styling
- ✅ GSAP animations
- ✅ Apollo GraphQL client
- ✅ JWT authentication
- ✅ HTTP interceptors
- ✅ Route guards
- ✅ Reactive forms
- ✅ TypeScript strict mode

## Project Structure

\`\`\`
.
├── config-server/          # Centralized configuration
├── eureka-server/          # Service discovery
├── gateway-service/        # API Gateway
├── cours-service/          # Course management
├── inscription-service/    # Enrollment management
├── statistique-service/    # YouTube analytics
└── next-app/  # NextJs frontend
\`\`\`

## Technologies Used

### Backend
- Spring Boot 3.2.0
- Spring Cloud 2023.0.0
- Spring Data JPA
- Spring Data REST
- Spring for GraphQL
- Spring Security
- MySQL
- JJWT 0.12.3
- MapStruct 1.5.5
- Lombok

### Frontend
- NextJs
- TailwindCSS 3.3.6
- GSAP 3.12.4
- Apollo Angular 6.0.0
- RxJS 7.8.0

## Notes

- This is an academic project for local development only
- No deployment or CI/CD configuration included
- OAuth2 Google login requires proper credentials configuration
- YouTube API key required for statistics service

## License

Academic project - For educational purposes only
