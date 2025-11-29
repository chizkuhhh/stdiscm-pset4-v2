# Distributed Fault Tolerance (Online Enrollment System)
A fault-tolerant distributed enrollment system with database redundancy and individual microservices.

## Architecture Overview

### Microservices (Independent Nodes)
- **Frontend (Port 5173):** React + Vite - User interface
- **Auth Service (Port 4001)**: User authentication, JWT session management
- **Course Service (Port 4002)**: Course management, view enrolled students (faculty), view taught courses (faculty)
- **Grades Service (Port 4003)**: Grade upload (faculty) and grade viewing (students)
- **Enrollment Service (Port 4004)**: Student enrollment, drop courses, view enrollments
- **DB Service**: Shared Prisma schema, seed data, and database client configuration

### Database Layer (Redundancy)
- **PostgreSQL Primary (Port 5434)**: Handles WRITE operations (Docker container)
- **PostgreSQL Replica (Port 5435)**: Handles READ operations (Docker container)
- **Replication**: PostgreSQL logical replication from primary to replica

## Database Redundancy Implementation

### Service-Level Routing
Simple microservices connect to a single database:
```env
# Auth Service → Primary (write operations)
DATABASE_URL=postgresql://postgres:password@localhost:5434/enrollment

# Course Service → Replica (read operations)  
DATABASE_URL=postgresql://postgres:password@localhost:5435/enrollment
```

### Client-Level Routing
Complex microservices with mixed operations use dual Prisma clients:
```typescript
// Grades & Enrollment Services (prisma.ts)
import { PrismaClient } from "../../db-service/node_modules/@prisma/client";

// For WRITE operations → Primary
export const prismaWrite = new PrismaClient({
  datasources: {
    db: { url: "postgresql://postgres:password@localhost:5434/enrollment" }
  }
});

// For READ operations → Replica
export const prismaRead = new PrismaClient({
  datasources: {
    db: { url: "postgresql://postgres:password@localhost:5435/enrollment" }
  }
});
```

**Usage in route handlers:**
```typescript
// READ - Fetch grades from replica
const grades = await prismaRead.grades.findMany({ where: { studentId } });

// WRITE - Upload grade to primary
await prismaWrite.grades.create({ data: { courseId, studentId, grade, term } });
```

## Features Implemented

### Core Requirements
1. Login/Logout with JWT session tracking
2. View available courses with enrollment counts
3. Student enrollment in courses (with capacity limits)
4. Students view previous grades
5. Faculty upload grades

### Bonus Features
1. **Database Redundancy** - Primary-replica PostgreSQL setup
2. **Additional Features**:
   - Interactive dashboards (Student & Faculty)
   - Course capacity management with real-time counts
   - Drop courses functionality
   - View enrolled students per course (faculty)
   - Grade upload function from student list

## Tech Stack
- **Frontend**: React, TypeScript, TailwindCSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL 15 with Prisma ORM
- **Authentication**: JWT (jsonwebtoken, bcrypt)
- **Containerization**: Docker & Docker Compose

## Prerequisites
- Node.js (v18+)
- Docker Desktop
- npm or yarn
