import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function findOrCreateUser(email: string, role: Role, plainPassword = "password123") {
  const existing = await prisma.users.findUnique({ where: { email } });
  if (existing) return existing;
  const passwordHash = await bcrypt.hash(plainPassword, 10);
  return prisma.users.create({
    data: { email, role, passwordHash }
  });
}

async function findOrCreateCourse(
  code: string, 
  title: string, 
  facultyId: number, 
  section: string = "A",
  capacity = 5
) {
  const existing = await prisma.courses.findFirst({ 
    where: { code, section }
  });
  if (existing) return existing;
  
  return prisma.courses.create({
    data: { code, title, section, facultyId, capacity }
  });
}

async function resetSequences() {
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Users"', 'id'), COALESCE(MAX(id), 1)) FROM "Users"`;
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Courses"', 'id'), COALESCE(MAX(id), 1)) FROM "Courses"`;
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Enrollments"', 'id'), COALESCE(MAX(id), 1)) FROM "Enrollments"`;
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Grades"', 'id'), COALESCE(MAX(id), 1)) FROM "Grades"`;
}

async function main() {
  console.log("Seeding database...");

  // FACULTY
  const faculty1 = await findOrCreateUser("prof.jane@school.com", Role.faculty);
  const faculty2 = await findOrCreateUser("prof.john@school.com", Role.faculty);
  const faculty3 = await findOrCreateUser("prof.maria@school.com", Role.faculty);

  console.log("Faculty created");

  // STUDENTS
  const student1 = await findOrCreateUser("student.anna@school.com", Role.student);
  const student2 = await findOrCreateUser("student.ben@school.com", Role.student);
  const student3 = await findOrCreateUser("student.cara@school.com", Role.student);
  const student4 = await findOrCreateUser("student.david@school.com", Role.student);
  const student5 = await findOrCreateUser("student.emma@school.com", Role.student);
  const student6 = await findOrCreateUser("student.frank@school.com", Role.student);
  const student7 = await findOrCreateUser("student.grace@school.com", Role.student);
  const student8 = await findOrCreateUser("student.henry@school.com", Role.student);

  console.log("Students created");

  // COURSES
  const course1a = await findOrCreateCourse("CS101", "Introduction to CS", faculty1.id, "A", 5);
  const course1b = await findOrCreateCourse("CS101", "Introduction to CS", faculty1.id, "B", 5);
  
  const course2a = await findOrCreateCourse("MATH201", "Advanced Calculus", faculty2.id, "A", 5);
  const course2b = await findOrCreateCourse("MATH201", "Advanced Calculus", faculty2.id, "B", 3);
  
  const course3a = await findOrCreateCourse("PHY150", "Physics I", faculty1.id, "A", 5);
  
  const course4a = await findOrCreateCourse("ENG100", "English Composition", faculty3.id, "A", 3);
  
  const course5a = await findOrCreateCourse("HIST202", "World History", faculty2.id, "A", 5);

  console.log("Courses created");

  // ENROLLMENTS
  const enrollments = [
    { studentId: student1.id, courseId: course1a.id },
    { studentId: student2.id, courseId: course1a.id },
    { studentId: student3.id, courseId: course1b.id },  // Different section
    { studentId: student4.id, courseId: course1b.id },
    
    { studentId: student5.id, courseId: course2a.id },
    { studentId: student6.id, courseId: course2b.id },  // Different section
    
    { studentId: student1.id, courseId: course3a.id },
    { studentId: student3.id, courseId: course3a.id },
    { studentId: student5.id, courseId: course3a.id },
    { studentId: student7.id, courseId: course3a.id },
    
    { studentId: student2.id, courseId: course4a.id },
    { studentId: student4.id, courseId: course4a.id },
    { studentId: student8.id, courseId: course4a.id },
    
    { studentId: student6.id, courseId: course5a.id },
  ];

  for (const enrollment of enrollments) {
    const exists = await prisma.enrollments.findFirst({
      where: { 
        studentId: enrollment.studentId, 
        courseId: enrollment.courseId 
      }
    });
    
    if (!exists) {
      await prisma.enrollments.create({ data: enrollment });
    }
  }

  console.log("Enrollments created");

  // GRADES
  async function ensureGrade(sid: number, cid: number, grade: string, term: string) {
    const g = await prisma.grades.findFirst({
      where: { studentId: sid, courseId: cid, grade, term }
    });
    if (!g) {
      await prisma.grades.create({
        data: { studentId: sid, courseId: cid, grade, term }
      });
    }
  }

  await ensureGrade(student1.id, course1a.id, "A", "2024 Term 1");
  await ensureGrade(student2.id, course1a.id, "B+", "2024 Term 1");
  await ensureGrade(student3.id, course1b.id, "A-", "2024 Term 1");
  await ensureGrade(student5.id, course2a.id, "A", "2024 Term 1");
  await ensureGrade(student6.id, course2b.id, "B", "2024 Term 1");

  await resetSequences()
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error(err);
    prisma.$disconnect();
    process.exit(1);
  });