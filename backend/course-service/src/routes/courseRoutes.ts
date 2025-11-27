import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { jwtMiddleware, AuthRequest } from "../authMiddleware";

const router = Router();
const prisma = new PrismaClient();

// GET all courses
router.get("/", jwtMiddleware, async (req, res) => {
  const courses = await prisma.courses.findMany();
  res.json(courses);
});

// POST new course (faculty only)
router.post("/", jwtMiddleware, async (req: AuthRequest, res) => {
  if (req.user?.role !== "faculty") {
    return res.status(403).json({ error: "Faculty only" });
  }

  const { code, title, capacity } = req.body;

  if (!code || !title) {
    return res.status(400).json({ error: "Missing code or title" });
  }

  const course = await prisma.courses.create({
    data: {
      code,
      title,
      capacity: capacity ?? null,
      facultyId: req.user.id, // IMPORTANT: user.id must be in JWT
    },
  });

  return res.json({ message: "Course created", course });
});

export default router;