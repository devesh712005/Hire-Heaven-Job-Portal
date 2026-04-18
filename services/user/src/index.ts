import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.js";
import cors from "cors";
import promClient from "prom-client";

dotenv.config();
const app = express();

// ✅ Prometheus setup
const register = promClient.register;
promClient.collectDefaultMetrics();

app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});
app.use(cors());
app.use(express.json());
app.use("/api/user", userRoutes);
app.listen(process.env.PORT, () => {
  console.log(
    `User service is running on http://localhost:${process.env.PORT}`,
  );
});
