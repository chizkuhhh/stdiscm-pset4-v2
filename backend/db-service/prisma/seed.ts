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

async function findOrCreateCourse(code: string, title: string, facultyId: number, capacity = 30) {
  // code is not unique in your schema, so use findFirst
  const existing = await prisma.courses.findFirst({ where: { code } });
  if (existing) return existing;
  return prisma.courses.create({
    data: { code, title, facultyId, capacity }
  });
}

async function main() {
  console.log("🌱 Seeding database...");

  // USERS (faculty + students)
  const faculty1 = await findOrCreateUser("prof.jane@school.com", Role.faculty);
  const faculty2 = await findOrCreateUser("prof.john@school.com", Role.faculty);

  const student1 = await findOrCreateUser("student.anna@school.com", Role.student);
  const student2 = await findOrCreateUser("student.ben@school.com", Role.student);
  const student3 = await findOrCreateUser("student.cara@school.com", Role.student);

  console.log("👩‍🏫 Faculty + 👨‍🎓 Students ensured");

  // COURSES
  const course1 = await findOrCreateCourse("CS101", "Introduction to CS", faculty1.id, 30);
  const course2 = await findOrCreateCourse("MATH201", "Advanced Calculus", faculty2.id, 40);
  const course3 = await findOrCreateCourse("PHY150", "Physics I", faculty1.id, 50);

  console.log("📚 Courses ensured");

  // ENROLLMENTS — create only if not exists
  const enrollExists1 = await prisma.enrollments.findFirst({
    where: { studentId: student1.id, courseId: course1.id }
  });
  if (!enrollExists1) {
    await prisma.enrollments.create({
      data: { studentId: student1.id, courseId: course1.id }
    });
  }

  const enrollExists2 = await prisma.enrollments.findFirst({
    where: { studentId: student2.id, courseId: course1.id }
  });
  if (!enrollExists2) {
    await prisma.enrollments.create({
      data: { studentId: student2.id, courseId: course1.id }
    });
  }

  const enrollExists3 = await prisma.enrollments.findFirst({
    where: { studentId: student3.id, courseId: course2.id }
  });
  if (!enrollExists3) {
    await prisma.enrollments.create({
      data: { studentId: student3.id, courseId: course2.id }
    });
  }

  console.log("📝 Enrollments ensured");

  // GRADES — create only if not exists (simple check by same tuple)
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
  await ensureGrade(student3.id, course2.id, "A-", "2024 Term 1");

  console.log("📊 Grades ensured");

  console.log("🌱 Seed complete!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error(err);
    prisma.$disconnect();
    process.exit(1);
  });
