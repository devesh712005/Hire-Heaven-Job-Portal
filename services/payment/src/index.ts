import express from "express";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import cors from "cors";
import paymentRoutes from "./routes/payment.js";
import promClient from "prom-client";

dotenv.config();

export const instance = new Razorpay({
  key_id: process.env.Razorpay_key,
  key_secret: process.env.Razorpay_Secret,
});

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
app.use("/api/payment", paymentRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Payment service is running on ${process.env.PORT}`);
});
