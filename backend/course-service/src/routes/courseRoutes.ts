import { Router } from "express";
import { prisma } from '../prisma';
import { jwtMiddleware, AuthRequest } from "../authMiddleware";
import { getEnrollmentCount, getCourseEnrollments } from "../grpcClient";

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

    // get enrollment counts with gRPC
    const coursesWithCounts = await Promise.all(
      courses.map(async (course) => {
        try {
          const enrolledCount = await getEnrollmentCount(course.id)
          return { ...course, enrolledCount }
        } catch (err) {
          console.error(`Failed to get course cound for course ${course.id}:`, err)
          return { ...course, enrolledCount: 0}
        }
      })
    )

    res.json(coursesWithCounts);
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

    // Get enrollments via gRPC
    const enrollmentData = await getCourseEnrollments(courseId)

    res.json({
      course: {
        id: courseId,
        code: course.code,
        title: course.title
      },
      students: enrollmentData.students,
      totalEnrolled: enrollmentData.totalEnrolled
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
        faculty: { select: { email: true } }
      }
    });

    // get enrollment counts via gRPC
    const coursesWithCounts = await Promise.all(
      courses.map(async (c) => {
        try {
          const enrolledCount = await getEnrollmentCount(c.id)
          return {
            id: c.id,
            code: c.code,
            title: c.title,
            faculty: c.faculty.email,
            capacity: c.capacity,
            enrolledCount
          }
        } catch (err) {
          console.error(`Failed to get count for course ${c.id}:`, err)
          return {
            id: c.id,
            code: c.code,
            title: c.title,
            faculty: c.faculty.email,
            capacity: c.capacity,
            enrolledCount: 0
          }
        }
      })
    )

    res.json(coursesWithCounts)

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

export default router;