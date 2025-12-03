import { PrismaClient } from "../../db-service/node_modules/@prisma/client";

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:password@localhost:5434/enrollment"
    }
  }
});