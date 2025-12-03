import express from "express";
import cors from "cors";
import { startGrpcServer } from './grpcServer'
import enrollmentRoutes from '../src/routes/enrollmentRoutes'
import 'dotenv/config'

const app = express();
app.use(cors());
app.use(express.json());

app.use("/enroll", enrollmentRoutes);

app.listen(4004, () => {
  console.log("Enrollment Service running on http://localhost:4004");
});

startGrpcServer()