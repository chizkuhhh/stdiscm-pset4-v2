import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { usersRouter } from "./src/routes/users";
import { coursesRouter } from "./src/routes/courses";
import { gradesRouter } from "./src/routes/grades";
import { enrollRouter } from "./src/routes/enrollments";

const app = express();
const PORT = process.env.PORT || 4010;

app.use(cors());
app.use(express.json());

app.use("/users", usersRouter);
app.use("/courses", coursesRouter);
app.use("/grades", gradesRouter);
app.use("/enrollments", enrollRouter);

app.get("/", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`DB Service running at http://localhost:${PORT}`);
});
