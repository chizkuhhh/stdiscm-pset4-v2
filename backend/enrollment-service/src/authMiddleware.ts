import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export function jwtMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  const [, token] = header.split(" ");
  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    // decode JWT
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "dev-secret-key"
    ) as any;

    // attach user info
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}