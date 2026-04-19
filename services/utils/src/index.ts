import express from "express";
import dotenv from "dotenv";
import routes from "./routes.js";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import { startSendMailConsumer } from "./consumer.js";
import promClient from "prom-client";

dotenv.config();
startSendMailConsumer().catch(console.error);

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
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
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// 🔥 Metrics middleware (before routes)
app.use((req, res, next) => {
  if (req.path === "/metrics") return next(); // optional but recommended

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
        service: "utils", // ✅ FIXED
      },
      duration,
    );
  });

  next();
});

// ✅ Routes
app.use("/api/utils", routes);

// ✅ Metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// ✅ Start server
app.listen(process.env.PORT, () => {
  console.log(`Utils Service is running on ${process.env.PORT}`);
});
