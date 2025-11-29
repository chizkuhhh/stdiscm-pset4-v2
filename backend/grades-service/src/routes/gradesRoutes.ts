import { Router } from "express";
import { jwtMiddleware, AuthRequest } from "../authMiddleware";
import { prismaRead, prismaWrite } from "../prisma";

const router = Router();

router.get("/", jwtMiddleware, async (req: AuthRequest, res) => {
  if (req.user?.role !== "student") {
    return res.status(403).json({ error: "Students only" });
  }

  const studentEmail = req.user.email;

  // Get student's DB record
  const student = await prismaRead.users.findUnique({
    where: { email: studentEmail },
  });

  if (!student) return res.status(404).json({ error: "Student not found" });

  // Fetch grades with course + faculty name
  const grades = await prismaRead.grades.findMany({
    where: { studentId: student.id },
    include: {
      course: {
        include: {
          faculty: true, // fetch faculty user
        },
      },
    },
  });

  // Shape the data for the frontend
  const output = grades.map((g) => ({
    courseId: g.courseId,
    courseCode: g.course.code,
    courseTitle: g.course.title,
    faculty: g.course.faculty.email,
    grade: g.grade,
    term: g.term
  }));

  return res.json(output);
});


// POST /grades/upload — faculty only
router.post("/upload", jwtMiddleware, async (req: AuthRequest, res) => {
  if (req.user?.role !== "faculty") {
    return res.status(403).json({ error: "Faculty only" });
  }

  const { courseCode, studentEmail, grade, term } = req.body;

  if (!courseCode || !studentEmail || !grade || !term) {
    return res.status(400).json({ error: "All fields required" });
  }

  // Get faculty user
  const faculty = await prismaRead.users.findUnique({
    where: { email: req.user.email }
  });

  if (!faculty) return res.status(404).json({ error: "Faculty not found" });

  // Fetch course taught by faculty
  const course = await prismaRead.courses.findFirst({
    where: {
      code: courseCode,
      facultyId: faculty.id,
    }
  });

  if (!course)
    return res.status(404).json({ error: "Course not found or not taught by you" });

  // Get student
  const student = await prismaRead.users.findUnique({
    where: { email: studentEmail },
  });

  if (!student)
    return res.status(404).json({ error: "Student not found" });

  // Create grade record
  const newGrade = await prismaWrite.grades.create({
    data: {
      courseId: course.id,
      studentId: student.id,
      grade,
      term,
    }
  });

  return res.json({ message: "Grade uploaded successfully", grade: newGrade });
});

export default router;