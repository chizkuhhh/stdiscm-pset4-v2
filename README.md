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

## Installation & Setup
### 1. Clone Repository
```bash
git clone https://github.com/chizkuhhh/stdiscm-pset4-v2.git
cd stdiscm-pset4-v2
```

### 2. Start Database Containers
```bash
# Start both primary and replica databases
docker-compose up -d

# Verify containers are running
docker ps
```

You should see:
```
CONTAINER ID   IMAGE                  STATUS    PORTS
enrollment-db-primary    postgres:15-alpine   Up        0.0.0.0:5434->5432/tcp
enrollment-db-replica    postgres:15-alpine   Up        0.0.0.0:5435->5432/tcp
```

### 3. Configure Database Replication

#### Setup Primary Database
```bash
# Connect to primary
docker exec -it enrollment-db-primary psql -U postgres -d enrollment

# Create publication for replication
CREATE PUBLICATION my_publication FOR ALL TABLES;
\q
```

#### Setup Replica Database
```bash
# Connect to replica
docker exec -it enrollment-db-replica psql -U postgres -d enrollment

# Create subscription to primary
CREATE SUBSCRIPTION my_subscription
CONNECTION 'host=postgres-primary port=5432 dbname=enrollment user=postgres password=password'
PUBLICATION my_publication;
\q
```

#### Verify Replication is Working
```bash
# Check subscription status
docker exec -it enrollment-db-replica psql -U postgres -d enrollment -c "SELECT subname, subenabled, pid FROM pg_stat_subscription;"
```

Expected output:
```
    subname      | subenabled | pid  
-----------------+------------+------
 my_subscription | t          | [PID]
```

### 4. Install Dependencies
```bash
# Auth Service
cd backend/auth-service
npm install

# Course Service
cd ../course-service
npm install

# Grades Service
cd ../grades-service
npm install

# Enrollment Service
cd ../enrollment-service
npm install

# DB Service
cd ../db-service
npm install

# Frontend
cd ../../frontend
npm install
```

### 5. Setup Database Schema
```bash
cd backend/db-service

# Generate Prisma client
npx prisma generate

# Run migrations on PRIMARY database
DATABASE_URL="postgresql://postgres:password@localhost:5434/enrollment" npx prisma migrate deploy

# Seed initial data
DATABASE_URL="postgresql://postgres:password@localhost:5434/enrollment" npx prisma db seed
```

Wait ~5 seconds for data to replicate to replica database.

### 6. Start All Services

Open **5 separate terminal windows**:

**Terminal 1 - Auth Service:**
```bash
cd backend/auth-service
npm run dev
# ✓ Auth Service running on http://localhost:4001
```

**Terminal 2 - Course Service:**
```bash
cd backend/course-service
npm run dev
# ✓ Course Service running on http://localhost:4002
```

**Terminal 3 - Grades Service:**
```bash
cd backend/grades-service
npm run dev
# ✓ Grades Service running on http://localhost:4003
```

**Terminal 4 - Enrollment Service:**
```bash
cd backend/enrollment-service
npm run dev
# ✓ Enrollment Service running on http://localhost:4004
```

**Terminal 5 - Frontend:**
```bash
cd frontend
npm run dev
# ✓ Frontend running on http://localhost:5173
```

### 7. Access the Application
Open your browser and navigate to: **http://localhost:5173**

## Test Accounts (from seed data)

### Faculty Accounts
- **Prof. Jane**: `prof.jane@school.com` / `password123`
- **Prof. John**: `prof.john@school.com` / `password123`
- **Prof. Maria**: `prof.maria@school.com` / `password123`

### Student Accounts
- **Anna**: `student.anna@school.com` / `password123`
- **Ben**: `student.ben@school.com` / `password123`
- **Cara**: `student.cara@school.com` / `password123`
- **David**: `student.david@school.com` / `password123`
- **Emma**: `student.emma@school.com` / `password123`

### Seeded Courses
- **CS101** - Introduction to CS (4/5 enrolled)
- **MATH201** - Advanced Calculus (2/5 enrolled)
- **PHY150** - Physics I (4/5 enrolled)
- **ENG100** - English Composition (3/3 enrolled - FULL)
- **HIST202** - World History (1/5 enrolled)
