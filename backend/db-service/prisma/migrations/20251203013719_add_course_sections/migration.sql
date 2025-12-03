/*
  Warnings:

  - A unique constraint covering the columns `[code,section]` on the table `Courses` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Courses" ADD COLUMN     "section" TEXT NOT NULL DEFAULT 'A';

-- CreateIndex
CREATE UNIQUE INDEX "Courses_code_section_key" ON "Courses"("code", "section");
