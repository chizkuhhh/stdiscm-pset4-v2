import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '../prisma';

const router = express.Router();

/*
  STEP 1 — email → generate verification code (in-memory)
*/

const verificationCodes = new Map<string, string>();

router.post('/signup/start', (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email required" });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  verificationCodes.set(email, code);

  console.log(`Verification code for ${email}: ${code}`);

  return res.json({ message: "Verification code generated" });
});


/*
  STEP 2 — verify code
*/
router.post('/signup/verify', (req, res) => {
  const { email, code } = req.body;

  if (!email || !code)
    return res.status(400).json({ message: "Email and code required" });

  const stored = verificationCodes.get(email);

  if (!stored)
    return res.status(400).json({ message: "Code expired or not found" });

  if (stored !== code)
    return res.status(400).json({ message: "Invalid code" });

  // OK — delete code
  verificationCodes.delete(email);

  console.log(`Verified ${email}`);

  return res.json({ message: "Verification accepted!" });
});


/*
  STEP 3 — complete signup (password + role)
*/
router.post('/signup/complete', async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  const normalizedRole = role === "faculty" ? "faculty" : "student";

  const existing = await prisma.users.findUnique({ where: {email} })
  if (existing)
      return res.status(400).json({ message: "Email already registered" })
  
  const hash = await bcrypt.hash(password, 10)

  const newUser = await prisma.users.create({
    data: {
      email,
      passwordHash: hash,
      role: normalizedRole
    }
  })

  return res.json({
    message: "Account created!",
    user: {
      email: newUser.email,
      role: newUser.role,
    },
  })
});


/*
  LOGIN
*/
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  const user = await prisma.users.findUnique({
    where: { email },
  })

  if (!user)
    return res.status(400).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.passwordHash)

  if (!valid)
    return res.status(400).json({ message: "Invalid password" });

  // JWT includes role now!
  const token = jwt.sign(
    { email: user.email, role: user.role },
    process.env.JWT_SECRET || "dev-secret-key",
    { expiresIn: "1h" }
  );

  return res.json({
    message: "Login successful",
    token,
    user: {
      email: user.email,
      role: user.role
    }
  });
});


/*
  LOGOUT (stateless — just client deletes token)
*/
router.post('/logout', (req, res) => {
  return res.json({ message: "Logged out" });
});


export default router;