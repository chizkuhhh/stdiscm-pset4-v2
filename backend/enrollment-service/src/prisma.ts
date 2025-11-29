import { PrismaClient } from "../../db-service/node_modules/@prisma/client";

// For WRITING (uploads)
export const prismaWrite = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:password@localhost:5434/enrollment"
    }
  }
});

// For READING (viewing)
export const prismaRead = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:password@localhost:5435/enrollment"
    }
  }
});
