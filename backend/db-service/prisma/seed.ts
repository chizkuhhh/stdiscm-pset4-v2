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

async function findOrCreateCourse(code: string, title: string, facultyId: number, capacity = 5) {
  // code is not unique in your schema, so use findFirst
  const existing = await prisma.courses.findFirst({ where: { code } });
  if (existing) return existing;
  return prisma.courses.create({
    data: { code, title, facultyId, capacity }
  });
}

async function main() {
  console.log("🌱 Seeding database...");

  // FACULTY
  const faculty1 = await findOrCreateUser("prof.jane@school.com", Role.faculty);
  const faculty2 = await findOrCreateUser("prof.john@school.com", Role.faculty);
  const faculty3 = await findOrCreateUser("prof.maria@school.com", Role.faculty);

  console.log("👩‍🏫 Faculty created");

  // STUDENTS (create more for testing capacity limits)
  const student1 = await findOrCreateUser("student.anna@school.com", Role.student);
  const student2 = await findOrCreateUser("student.ben@school.com", Role.student);
  const student3 = await findOrCreateUser("student.cara@school.com", Role.student);
  const student4 = await findOrCreateUser("student.david@school.com", Role.student);
  const student5 = await findOrCreateUser("student.emma@school.com", Role.student);
  const student6 = await findOrCreateUser("student.frank@school.com", Role.student);
  const student7 = await findOrCreateUser("student.grace@school.com", Role.student);
  const student8 = await findOrCreateUser("student.henry@school.com", Role.student);

  console.log("👨‍🎓 Students created");

  // COURSES (capacity of 5 for easy testing)
  const course1 = await findOrCreateCourse("CS101", "Introduction to CS", faculty1.id, 5);
  const course2 = await findOrCreateCourse("MATH201", "Advanced Calculus", faculty2.id, 5);
  const course3 = await findOrCreateCourse("PHY150", "Physics I", faculty1.id, 5);
  const course4 = await findOrCreateCourse("ENG100", "English Composition", faculty3.id, 3); // smaller for testing
  const course5 = await findOrCreateCourse("HIST202", "World History", faculty2.id, 5);

  console.log("📚 Courses created");

  // ENROLLMENTS — fill CS101 to near capacity (4/5)
  const enrollments = [
    { studentId: student1.id, courseId: course1.id },
    { studentId: student2.id, courseId: course1.id },
    { studentId: student3.id, courseId: course1.id },
    { studentId: student4.id, courseId: course1.id },
    
    // MATH201 - partially filled (2/5)
    { studentId: student5.id, courseId: course2.id },
    { studentId: student6.id, courseId: course2.id },
    
    // PHY150 - almost full (4/5)
    { studentId: student1.id, courseId: course3.id },
    { studentId: student3.id, courseId: course3.id },
    { studentId: student5.id, courseId: course3.id },
    { studentId: student7.id, courseId: course3.id },
    
    // ENG100 - completely full (3/3)
    { studentId: student2.id, courseId: course4.id },
    { studentId: student4.id, courseId: course4.id },
    { studentId: student8.id, courseId: course4.id },
    
    // HIST202 - only 1 student (1/5)
    { studentId: student6.id, courseId: course5.id },
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

  console.log("📝 Enrollments created");

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

  await ensureGrade(student1.id, course1.id, "A", "2024 Term 1");
  await ensureGrade(student2.id, course1.id, "B+", "2024 Term 1");
  await ensureGrade(student3.id, course1.id, "A-", "2024 Term 1");
  await ensureGrade(student5.id, course2.id, "A", "2024 Term 1");
  await ensureGrade(student6.id, course2.id, "B", "2024 Term 1");

  console.log("📊 Grades created");

  console.log("✅ Seed complete!");
  console.log("\nTest scenarios:");
  console.log("- CS101: 4/5 (almost full)");
  console.log("- MATH201: 2/5 (half full)");
  console.log("- PHY150: 4/5 (almost full)");
  console.log("- ENG100: 3/3 (FULL - test capacity blocking)");
  console.log("- HIST202: 1/5 (mostly empty)");
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error(err);
    prisma.$disconnect();
    process.exit(1);
  });