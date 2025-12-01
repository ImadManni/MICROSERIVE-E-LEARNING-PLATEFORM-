# Diagram Generator Guide - E-Learning Platform

## 📊 Available Diagrams

This project includes diagrams in multiple formats for academic documentation:

1. **Use Case Diagram** - Shows actors and their interactions
2. **Class Diagram** - Shows entities and relationships
3. **Microservices Architecture Diagram** - Shows system architecture

## 🌐 Online Diagram Generators

### Option 1: PlantUML (Recommended)
**Website:** https://www.plantuml.com/plantuml/uml/

**How to use:**
1. Go to https://www.plantuml.com/plantuml/uml/
2. Copy content from:
   - `USE-CASE-DIAGRAM.puml`
   - `CLASS-DIAGRAM.puml`
   - `MICROSERVICES-ARCHITECTURE-DIAGRAM.puml`
3. Paste into the editor
4. Click "Submit" to generate diagram
5. Right-click diagram → "Save image as..." to download

**Alternative PlantUML sites:**
- http://www.plantuml.com/plantuml/uml/ (official)
- https://plantuml-editor.kkeisuke.com/ (with preview)

### Option 2: Mermaid (Interactive)
**Website:** https://mermaid.live/

**How to use:**
1. Go to https://mermaid.live/
2. Copy content from:
   - `USE-CASE-DIAGRAM.mmd`
   - `CLASS-DIAGRAM.mmd`
   - `MICROSERVICES-ARCHITECTURE.mmd`
3. Paste into the editor
4. Diagram generates automatically
5. Click "Actions" → "Download PNG/SVG" to save

**Alternative Mermaid sites:**
- https://mermaid.live/ (official)
- https://mermaid-js.github.io/mermaid-live-editor/ (alternative)

### Option 3: Draw.io (Visual Editor)
**Website:** https://app.diagrams.net/

**How to use:**
1. Go to https://app.diagrams.net/
2. File → Import from → Device
3. Select `.puml` files (PlantUML format)
4. Or manually create using the templates
5. Export as PNG, PDF, or SVG

### Option 4: Visual Paradigm Online
**Website:** https://online.visual-paradigm.com/

**How to use:**
1. Go to https://online.visual-paradigm.com/
2. Create new diagram
3. Import PlantUML or create manually
4. Export in various formats

## 📋 Diagram Files

### Use Case Diagrams
- **PlantUML:** `USE-CASE-DIAGRAM.puml`
- **Mermaid:** `USE-CASE-DIAGRAM.mmd`

**Actors:**
- Student
- Admin
- Professor
- Google OAuth
- YouTube API

**Main Use Cases:**
- Authentication & Registration
- Course Management
- Enrollment Management
- Content Management
- Analytics & Statistics

### Class Diagrams
- **PlantUML:** `CLASS-DIAGRAM.puml`
- **Mermaid:** `CLASS-DIAGRAM.mmd`

**Main Classes:**
- Course, Category, Professor, Lesson (Cours Service)
- Student, Enrollment (Inscription Service)
- VideoStatistic (Statistique Service)
- Services and Controllers

### Architecture Diagrams
- **PlantUML:** `MICROSERVICES-ARCHITECTURE-DIAGRAM.puml`
- **Mermaid:** `MICROSERVICES-ARCHITECTURE.mmd`

**Shows:**
- Client Layer (Next.js Frontend)
- API Gateway Layer
- Service Discovery (Eureka, Config)
- Microservices (Cours, Inscription, Statistique)
- Data Layer (MySQL, Firestore)
- External Services (Google, YouTube)

## 🎓 Academic Use Case Description

### System: E-Learning Platform

**Actors:**
1. **Student** - End user who enrolls in courses
2. **Admin** - Platform administrator managing content
3. **Professor** - Course instructor creating content
4. **Google OAuth** - External authentication provider
5. **YouTube API** - External video statistics provider

**Main Use Cases:**

#### UC1: Register Account
- **Actor:** Student
- **Description:** Student creates a new account with email and password
- **Preconditions:** None
- **Postconditions:** Student account created in Firestore

#### UC2: Login with Email/Password
- **Actor:** Student, Admin, Professor
- **Description:** User authenticates with email and password
- **Preconditions:** Account must exist
- **Postconditions:** JWT token issued

#### UC3: Login with Google OAuth
- **Actor:** Student, Admin, Professor
- **Description:** User authenticates using Google account
- **Preconditions:** Google account must exist
- **Postconditions:** JWT token issued, student saved to Firestore

#### UC5: Browse Courses
- **Actor:** Student, Admin, Professor
- **Description:** View list of available courses
- **Preconditions:** User must be authenticated
- **Postconditions:** Course list displayed

#### UC8: Create Course
- **Actor:** Admin, Professor
- **Description:** Create a new course with details
- **Preconditions:** User must have admin/professor role
- **Postconditions:** Course saved to Firestore and MongoDB

#### UC13: Enroll in Course
- **Actor:** Student
- **Description:** Student enrolls in a course
- **Preconditions:** Student authenticated, course exists
- **Postconditions:** Enrollment record created in Firestore

#### UC21: View Course Statistics
- **Actor:** Admin
- **Description:** View analytics for courses
- **Preconditions:** Admin authenticated
- **Postconditions:** Statistics displayed

## 📝 Quick Start

1. **For Use Case Diagram:**
   - Open https://mermaid.live/
   - Copy `USE-CASE-DIAGRAM.mmd`
   - Paste and download

2. **For Class Diagram:**
   - Open https://www.plantuml.com/plantuml/uml/
   - Copy `CLASS-DIAGRAM.puml`
   - Paste and download

3. **For Architecture Diagram:**
   - Open https://mermaid.live/
   - Copy `MICROSERVICES-ARCHITECTURE.mmd`
   - Paste and download

## 💡 Tips

- **PlantUML** is best for detailed class diagrams
- **Mermaid** is best for quick, interactive diagrams
- **Draw.io** is best for manual editing and customization
- All formats can be exported as PNG, SVG, or PDF for academic papers

