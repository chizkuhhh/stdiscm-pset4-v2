import { Router } from "express";
import { prisma } from "../prisma";

export const gradesRouter = Router();

// get grades for student by email
gradesRouter.get("/student/:email", async (req, res) => {
  const email = req.params.email;
  const u = await prisma.users.findUnique({ where: { email } });
  if (!u) return res.status(404).json({ error: "student not found" });

  const grades = await prisma.grades.findMany({ where: { studentId: u.id } });
  res.json(grades);
});

// faculty posts a grade (accepts studentEmail)
gradesRouter.post("/", async (req, res) => {
  const { studentEmail, courseId, grade, term } = req.body;
  if (!studentEmail || !courseId || !grade || !term) return res.status(400).json({ error: "studentEmail/courseId/grade/term required" });

  const s = await prisma.users.findUnique({ where: { email: studentEmail } });
  if (!s) return res.status(404).json({ error: "student not found" });

  const g = await prisma.grades.create({
    data: {
      studentId: s.id,
      courseId,
      grade,
      term
    }
  });

  res.json(g);
});
