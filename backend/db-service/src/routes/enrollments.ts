import { Router } from "express";
import { prisma } from "../prisma";

export const enrollRouter = Router();

// enroll student by email or id
enrollRouter.post("/", async (req, res) => {
  const { studentEmail, studentId, courseId } = req.body;
  if (!courseId) return res.status(400).json({ error: "courseId required" });

  let sid = studentId;
  if (!sid && studentEmail) {
    const s = await prisma.users.findUnique({ where: { email: studentEmail } });
    if (!s) return res.status(400).json({ error: "student not found" });
    sid = s.id;
  }
  if (!sid) return res.status(400).json({ error: "studentId or studentEmail required" });

  // prevent duplicate enrollments
  const existing = await prisma.enrollments.findFirst({ where: { studentId: sid, courseId } });
  if (existing) return res.status(400).json({ error: "Already enrolled" });

  const enrollment = await prisma.enrollments.create({
    data: { studentId: sid, courseId }
  });

  res.json(enrollment);
});

// get enrollments for a student by email
enrollRouter.get("/student/:email", async (req, res) => {
  const email = req.params.email;
  const u = await prisma.users.findUnique({ where: { email } });
  if (!u) return res.status(404).json({ error: "student not found" });

  const enrolls = await prisma.enrollments.findMany({ where: { studentId: u.id } });
  res.json(enrolls);
});

// get enrollments for course
enrollRouter.get("/course/:id", async (req, res) => {
  const id = Number(req.params.id);
  const enrolls = await prisma.enrollments.findMany({ where: { courseId: id } });
  res.json(enrolls);
});
