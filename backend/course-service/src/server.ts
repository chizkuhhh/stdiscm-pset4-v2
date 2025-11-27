import express from "express";
import cors from "cors";
import courseRoutes from './routes/courseRoutes'
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/courses", courseRoutes);

app.listen(4002, () => console.log("Course Service running at http://localhost:4002"));
