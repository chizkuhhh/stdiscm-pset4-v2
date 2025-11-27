import { Router } from "express";
import { jwtMiddleware, AuthRequest } from "../authMiddleware";
import { getGradesForStudent } from "../gradeStore";

const router = Router();

// GET /grades
router.get("/", jwtMiddleware, (req: AuthRequest, res) => {
  if (req.user?.role !== "student")
    return res.status(403).json({ error: "Only students can view grades" });

  const email = req.user.email;
  const records = getGradesForStudent(email);

  res.json(records);
});

export default router;