import { Router } from "express";
import { prisma } from '../prisma';
import { jwtMiddleware, AuthRequest } from "../authMiddleware";

const router = Router();

// GET all courses
router.get("/", jwtMiddleware, async (req, res) => {
  try {
    const courses = await prisma.courses.findMany({
      include: {
        faculty: { select: { email: true } }
      }
    });

    res.json(
      courses.map(c => ({
        id: c.id,
        code: c.code,
        title: c.title,
        faculty: c.faculty.email,
      }))
    );

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
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