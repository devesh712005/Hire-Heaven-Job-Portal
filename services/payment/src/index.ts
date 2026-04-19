import express from "express";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import cors from "cors";
import paymentRoutes from "./routes/payment.js";
import promClient from "prom-client";

dotenv.config();

// ✅ Razorpay instance
export const instance = new Razorpay({
  key_id: process.env.Razorpay_key,
  key_secret: process.env.Razorpay_Secret,
});

const app = express();

// ✅ Prometheus setup
const register = promClient.register;
promClient.collectDefaultMetrics();

// ✅ Counter
const httpRequestsTotal = new promClient.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});

// ✅ Histogram (Latency)
const httpRequestDuration = new promClient.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status", "service"],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5],
});

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// 🔥 Metrics middleware (before routes)
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path;

    // Counter
    httpRequestsTotal.inc({
      method: req.method,
      route,
      status: res.statusCode,
    });

    // Histogram
    httpRequestDuration.observe(
      {
        method: req.method,
        route,
        status: res.statusCode,
        service: "payment", // ✅ FIXED
      },
      duration,
    );
  });

  next();
});

// ✅ Routes
app.use("/api/payment", paymentRoutes);

// ✅ Metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// ✅ Start server
app.listen(process.env.PORT, () => {
  console.log(`Payment service is running on ${process.env.PORT}`);
});
