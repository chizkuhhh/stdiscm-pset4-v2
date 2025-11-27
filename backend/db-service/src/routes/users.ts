import { Router } from "express";
import { prisma } from "../prisma";

export const usersRouter = Router();

// create user (used by auth-service)
usersRouter.post("/", async (req, res) => {
  const { email, passwordHash, role } = req.body;
  if (!email || !passwordHash || !role) return res.status(400).json({ error: "email/passwordHash/role required" });

  try {
    const user = await prisma.users.create({
      data: { email, passwordHash, role }
    });
    // don't return passwordHash to callers
    const { passwordHash: _ph, ...u } = user as any;
    res.json(u);
  } catch (err: any) {
    res.status(400).json({ error: err.message || "failed" });
  }
});

// get user by email
usersRouter.get("/:email", async (req, res) => {
  const { email } = req.params;
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: "not found" });
  res.json(user);
});

// get user by id
usersRouter.get("/id/:id", async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.users.findUnique({ where: { id } });
  if (!user) return res.status(404).json({ error: "not found" });
  res.json(user);
});