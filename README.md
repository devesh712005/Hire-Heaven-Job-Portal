# 🚀 Hire Heaven – Microservices Job Portal

A production-grade microservices-based job portal with real-time features, AI integration, and full DevOps deployment.

---

## 🌐 Live Links

* 🔗 Project: https://tech-devesh.in
* 📊 Grafana: https://tech-devesh.in/grafana
* 📈 Prometheus: https://tech-devesh.in/prometheus

---

## 🗄️ Database Architecture

* 📐 DB Diagram: https://dbdiagram.io/d/job-portal-database-architecture-69afbe27cf54053b6f48b91a

---

## ⚙️ Tech Stack

* **Frontend:** Next.js, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL (Neon DB)
* **Cache & Messaging:** Redis, Apache Kafka
* **DevOps:** Docker, Docker Compose, GitHub Actions, AWS EC2
* **Monitoring:** Prometheus + Grafana
* **Reverse Proxy:** Nginx

---

## ✨ Features

* 🔐 Authentication & Authorization (JWT)
* 👤 Job Seeker & Recruiter roles
* 📄 Resume Upload & AI Analysis
* 💳 Payment Integration (Razorpay)
* 📬 Email Notifications (Kafka-based via Utils Service)
* 📊 Real-time Monitoring (CPU, Memory, RPS, Latency)

---

## 🧱 Architecture

🚀 **[Explore Interactive Architecture Diagram](https://app.eraser.io/workspace/loXK72nFO8mR5EfbTw1J?origin=share)**

> **Architecture Overview:**
> The system follows a microservices architecture where requests flow from the Next.js frontend through an Nginx API Gateway to independent backend services (Auth, User, Job, Payment, and Utils).
>
> Each service handles a specific domain and communicates synchronously via REST APIs. For asynchronous tasks, Kafka is used as an event bus. Services publish events (e.g., email notifications) to Kafka, which are consumed by the Utils Service.
>
> The Utils Service acts as a shared service handling file uploads (Cloudinary), AI features (Gemini API), and background jobs like sending emails via SMTP.
>
> Data is stored in PostgreSQL (Neon DB), with Redis used for caching and secure token storage. Monitoring is centralized using Prometheus (metrics collection) and Grafana (visualization).

---

## 🚀 Run Locally

```bash
docker-compose up -d --build
```

---

## 📌 Highlights

* Scalable microservices architecture
* Event-driven system using Kafka
* Full CI/CD pipeline with GitHub Actions
* Production deployment on AWS EC2

---

## 👨‍💻 Author

Devesh Singh Chauhan
