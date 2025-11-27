import { Router } from "express";
import { jwtMiddleware, AuthRequest } from "../authMiddleware";
import { prisma } from "../prisma";

const router = Router();

router.get("/", jwtMiddleware, async (req: AuthRequest, res) => {
  if (req.user?.role !== "student")
    return res.status(403).json({ error: "Students only" });

  const grades = await prisma.grades.findMany({
    where: { student: { email: req.user.email } },
    include: { course: true },
  });

  res.json(grades);
});

router.post("/", jwtMiddleware, async (req: AuthRequest, res) => {
  if (req.user?.role !== "faculty")
    return res.status(403).json({ error: "Faculty only" });

  const { studentEmail, courseCode, grade, term } = req.body;

  const student = await prisma.users.findUnique({ where: { email: studentEmail } });
  const course = await prisma.courses.findFirst({ where: { code: courseCode } });

  const record = await prisma.grades.create({
    data: {
      grade,
      term,
      studentId: student!.id,
      courseId: course!.id,
    },
  });

  res.json(record);
});

export default router;