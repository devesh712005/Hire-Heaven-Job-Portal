import express from "express";
import authRoutes from "./routes/auth.js";
import { connectKafka } from "./producer.js";
import promClient from "prom-client";
import cors from "cors";

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
app.use(express.urlencoded({ extended: true }));

// 🔥 IMPORTANT: Metrics middleware MUST be BEFORE routes
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;

    const route = req.route?.path || req.path;

    // ✅ Counter
    httpRequestsTotal.inc({
      method: req.method,
      route,
      status: res.statusCode,
    });

    // ✅ Histogram
    httpRequestDuration.observe(
      {
        method: req.method,
        route,
        status: res.statusCode,
        service: "auth", // 🔥 correct service name
      },
      duration,
    );
  });

  next();
});

// ✅ Kafka connection
connectKafka();

// ✅ Routes (AFTER metrics middleware)
app.use("/api/auth", authRoutes);

// ✅ Metrics endpoint
app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

export default app;
