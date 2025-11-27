import { Router } from "express";
import { prisma } from "../prisma";

export const coursesRouter = Router();

// list all courses
coursesRouter.get("/", async (req, res) => {
  const courses = await prisma.courses.findMany();
  res.json(courses);
});

// create a course (accept facultyId or facultyEmail)
coursesRouter.post("/", async (req, res) => {
  const { code, title, capacity, facultyId, facultyEmail } = req.body;

  let fid = facultyId;
  if (!fid && facultyEmail) {
    const f = await prisma.users.findUnique({ where: { email: facultyEmail } });
    if (!f) return res.status(400).json({ error: "faculty not found" });
    fid = f.id;
  }
  if (!fid) return res.status(400).json({ error: "facultyId or facultyEmail required" });

  const course = await prisma.courses.create({
    data: { code, title, capacity: capacity ?? null, facultyId: fid }
  });

  res.json(course);
});

// get course by id
coursesRouter.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const course = await prisma.courses.findUnique({ where: { id } });
  if (!course) return res.status(404).json({ error: "not found" });
  res.json(course);
});