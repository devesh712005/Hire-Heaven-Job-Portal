import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.js";
import cors from "cors";
import promClient from "prom-client";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Prometheus setup
const register = promClient.register;
promClient.collectDefaultMetrics();

// ✅ Counter
const httpRequestsTotal = new promClient.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});
const httpRequestDuration = new promClient.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status", "service"],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5],
});

// ✅ Middleware (BEFORE routes)
app.use((req, res, next) => {
  const start = Date.now(); // ⏱ start timer

  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;

    // ✅ Counter
    httpRequestsTotal.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode,
    });

    // ✅ Histogram (NEW)
    httpRequestDuration.observe(
      {
        method: req.method,
        route: req.route?.path || req.path,
        status: res.statusCode,
        service: "user", // 🔥 IMPORTANT (change per service)
      },
      duration,
    );
  });

  next();
});

// ✅ Routes
app.use("/api/user", userRoutes);

// ✅ Metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// ✅ Start server
app.listen(process.env.PORT, () => {
  console.log(
    `User service is running on http://localhost:${process.env.PORT}`,
  );
});
