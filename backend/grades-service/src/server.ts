import express from "express";
import cors from "cors";
import "dotenv/config";
import gradesRoutes from '../src/routes/gradesRoutes'

const app = express();
app.use(cors());
app.use(express.json());

app.use("/grades", gradesRoutes);

app.listen(4003, () => {
  console.log("Grades Service running on http://localhost:4003");
});