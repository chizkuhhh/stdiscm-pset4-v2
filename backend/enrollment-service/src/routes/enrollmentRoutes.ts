import { Router } from "express";
import { prismaRead, prismaWrite } from "../prisma";
import { jwtMiddleware, AuthRequest } from "../authMiddleware";

const router = Router();

/* ---------------------------
   STUDENT’S ENROLLMENTS
---------------------------- */
router.get("/mine", jwtMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.user?.role !== "student") {
      return res.status(403).json({ error: "Only students can view enrollments" });
    }

    const enrollments = await prismaRead.enrollments.findMany({
      where: { studentId: req.user.id },
      include: {
        course: {
          include: {
            faculty: true
          }
        }
      }
    });

    res.json(
      enrollments.map((e) => ({
        courseId: e.courseId,
        code: e.course.code,
        title: e.course.title,
        faculty: e.course.faculty.email,
        enrolledAt: e.createdAt
      }))
    );
  } catch (err) {
    res.status(500).json({ error: "Failed to load enrollments" });
  }
});

router.delete("/drop/:courseId", jwtMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.user?.role !== "student")
      return res.status(403).json({ error: "Only students can drop classes" });

    const courseId = Number(req.params.courseId);

    // Check enrollment
    const existing = await prismaRead.enrollments.findFirst({
      where: {
        courseId,
        studentId: req.user.id,
      },
    });

    if (!existing)
      return res.status(400).json({ error: "You are not enrolled in this course" });

    // Delete enrollment
    await prismaWrite.enrollments.delete({ where: { id: existing.id } });

    res.json({ message: "Course dropped" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to drop course" });
  }
});

/* ---------------------------
   ENROLL IN A COURSE
---------------------------- */
router.post("/", jwtMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.user?.role !== "student") {
      return res.status(403).json({ error: "Only students can enroll" });
    }

    const { courseId } = req.body;

    if (!courseId) return res.status(400).json({ error: "courseId required" });

    // Check course exists
    const course = await prismaRead.courses.findUnique({ where: { id: Number(courseId) } });
    if (!course) return res.status(404).json({ error: "Course not found" });

    // Check capacity
    const currentCount = await prismaRead.enrollments.count({
      where: { courseId: Number(courseId) }
    });

    if (course.capacity && currentCount >= course.capacity) {
      return res.status(400).json({ error: "Course is already full" });
    }

    // Check if already enrolled
    const existing = await prismaRead.enrollments.findFirst({
      where: {
        courseId: Number(courseId),
        studentId: req.user.id
      }
    });

    if (existing) {
      return res.status(400).json({ error: "Already enrolled in this course" });
    }

    // Create enrollment
    const enroll = await prismaWrite.enrollments.create({
      data: {
        courseId: Number(courseId),
        studentId: req.user.id
      }
    });

    return res.json({ message: "Enrolled successfully", enroll });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Enrollment failed" });
  }
});

export default router;