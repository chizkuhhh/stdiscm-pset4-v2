import { Router } from "express"
import { getAllCourses, createCourse } from "../courseStore"
import { jwtMiddleware, AuthRequest } from "../authMiddleware"

const router = Router();

// GET all courses
router.get("/", jwtMiddleware, (req, res) => {
  res.json(getAllCourses());
});

// POST new course (faculty only)
router.post("/", jwtMiddleware, (req: AuthRequest, res) => {
  if (req.user?.role !== "faculty") {
    return res.status(403).json({ error: "Faculty only" });
  }

  const { code, title } = req.body;

  if (!code || !title) {
    return res.status(400).json({ error: "Missing code or title" });
  }

  const newCourse = createCourse(code, title, req.user.email);
  res.json({ message: "Course created", course: newCourse });
});

export default router;