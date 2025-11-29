import { Router } from "express";
import { prisma } from '../prisma';
import { jwtMiddleware, AuthRequest } from "../authMiddleware";

const router = Router();

// GET faculty courses (as in what courses they're teaching)
router.get("/my-courses", jwtMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.user?.role !== "faculty") {
      return res.status(403).json({ error: "Faculty only" });
    }

    const facultyId = req.user.id;

    const courses = await prisma.courses.findMany({
      where: { facultyId },
      select: {
        id: true,
        code: true,
        title: true,
        capacity: true
      },
    });

    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch faculty courses" });
  }
});

// GET students enrolled in a specific course (faculty only)
router.get("/:courseId/students", jwtMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.user?.role !== "faculty") {
      return res.status(403).json({ error: "Faculty only" });
    }

    const courseId = Number(req.params.courseId);

    // Verify the course belongs to this faculty member
    const course = await prisma.courses.findUnique({
      where: { id: courseId },
      select: { facultyId: true, code: true, title: true }
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    if (course.facultyId !== req.user.id) {
      return res.status(403).json({ error: "You can only view students in your own courses" });
    }

    // Get all enrollments for this course with student details
    const enrollments = await prisma.enrollments.findMany({
      where: { courseId },
      include: {
        student: {
          select: {
            id: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    res.json({
      course: {
        id: courseId,
        code: course.code,
        title: course.title
      },
      students: enrollments.map(e => ({
        studentId: e.student.id,
        email: e.student.email,
        enrolledAt: e.createdAt
      })),
      totalEnrolled: enrollments.length
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch course students" });
  }
});

// GET all courses
router.get("/", jwtMiddleware, async (req, res) => {
  try {
    const courses = await prisma.courses.findMany({
      include: {
        faculty: { select: { email: true } },
        enrollments: true
      }
    });

    res.json(
      courses.map(c => ({
        id: c.id,
        code: c.code,
        title: c.title,
        faculty: c.faculty.email,
        capacity: c.capacity,
        enrolledCount: c.enrollments.length
      }))
    );

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

export default router;