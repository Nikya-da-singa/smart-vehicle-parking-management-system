# 🚀 ParkFlow — Full Stack Deployment Guide

This guide walks you through deploying the **ParkFlow Smart Vehicle Parking Management System** (Spring Boot Backend + MySQL Database + React/Vite Frontend).

---

## 📋 Table of Contents
1. [Deployment Architecture](#-deployment-architecture)
2. [Option 1: Docker & Docker Compose (Recommended for VPS / Local)](#-option-1-docker-compose-vps--local)
3. [Option 2: Free Cloud Hosting (Render + Vercel + Free MySQL)](#-option-2-free-cloud-tier-render--vercel--aiven)
4. [Environment Variables Reference](#-environment-variables-reference)
5. [Troubleshooting & FAQs](#-troubleshooting--faqs)

---

## 🏗 Deployment Architecture

```
                       ┌─────────────────────────┐
                       │  User Browser / Client   │
                       └────────────┬────────────┘
                                    │ HTTPS
                                    ▼
                       ┌─────────────────────────┐
                       │   React + Vite Frontend  │
                       │   (Nginx / Vercel / CDN) │
                       └────────────┬────────────┘
                                    │ REST API (JWT)
                                    ▼
                       ┌─────────────────────────┐
                       │   Spring Boot Backend   │
                       │   (Port 8080 / Render)  │
                       └────────────┬────────────┘
                                    │ JDBC Connection
                                    ▼
                       ┌─────────────────────────┐
                       │     MySQL Database      │
                       │   (Port 3306 / Cloud)   │
                       └─────────────────────────┘
```

---

## 🐳 Option 1: Docker Compose (VPS / Local)

Deploy the entire stack (Database + Backend + Frontend) in one command on any Linux/Mac/Windows VPS or local machine.

### Prerequisites:
- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/) installed.

### Steps:

1. **Clone or navigate to the project directory**:
   ```bash
   cd smart-vehicle-parking-management-system
   ```

2. **Start all services**:
   ```bash
   docker compose up --build -d
   ```

3. **Verify running containers**:
   ```bash
   docker compose ps
   ```

4. **Access the application**:
   - **Frontend UI**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:8080](http://localhost:8080)
   - **MySQL Database**: `localhost:3306`

5. **Stop services**:
   ```bash
   docker compose down
   ```

---

## ☁️ Option 2: Free Cloud Tier (Render + Vercel + Aiven)

If you don't have a VPS and want free hosted URLs with automatic HTTPS:

### Step 1: Free MySQL Database (Aiven or Clever Cloud)
1. Sign up at [Aiven.io](https://aiven.io) (free trial) or [Clever Cloud](https://www.clever-cloud.com).
2. Create a free **MySQL** database named `smart_parking_db`.
3. Note your database:
   - **Host** (e.g. `mysql-xxxx.aivencloud.com`)
   - **Port** (e.g. `12345`)
   - **User** (e.g. `avnadmin`)
   - **Password** (e.g. `secretpassword`)
   - **JDBC URL**: `jdbc:mysql://<HOST>:<PORT>/smart_parking_db?useSSL=true&requireSSL=false`

---

### Step 2: Deploy Spring Boot Backend on Render.com
1. Sign up at [Render.com](https://render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository (`smart-vehicle-parking-management-system`).
4. Select **Docker** as the Runtime (it will automatically detect the root `Dockerfile`).
5. Under **Environment Variables**, add:
   | Key | Value |
   |-----|-------|
   | `SPRING_DATASOURCE_URL` | `jdbc:mysql://<HOST>:<PORT>/smart_parking_db?useSSL=true` |
   | `SPRING_DATASOURCE_USERNAME` | `<YOUR_DB_USER>` |
   | `SPRING_DATASOURCE_PASSWORD` | `<YOUR_DB_PASSWORD>` |
   | `SPRING_JPA_HIBERNATE_DDL_AUTO` | `update` |
   | `CORS_ALLOWED_ORIGINS` | `*` (or your frontend Vercel domain) |
   | `PORT` | `8080` |
6. Click **Create Web Service**.
7. Once deployed, copy your backend URL (e.g. `https://parkflow-api.onrender.com`).

---

### Step 3: Deploy React Frontend on Vercel
1. Sign up at [Vercel.com](https://vercel.com).
2. Click **Add New** -> **Project**.
3. Import your GitHub repository.
4. Set **Root Directory** to `frontend`.
5. Under **Environment Variables**, add:
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://parkflow-api.onrender.com` (Your backend URL from Step 2) |
6. Click **Deploy**.
7. Your app is live with a free `.vercel.app` URL and automatic HTTPS!

---

## 🔑 Environment Variables Reference

### Backend Configuration
| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8080` | HTTP port the Spring Boot server listens on |
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://localhost:3306/smart_parking_db...` | JDBC database connection string |
| `SPRING_DATASOURCE_USERNAME` | `root` | Database username |
| `SPRING_DATASOURCE_PASSWORD` | `Nikunj@2410` | Database password |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | `update` | Hibernate schema update mode (`update`, `validate`, `create-drop`) |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,http://localhost:3000` | Comma-separated list of allowed origins or `*` |

### Frontend Configuration
| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8080` | Backend API base URL consumed by Axios |

---

## 🛠 Troubleshooting & FAQs

#### 1. CORS Error in Browser Console
- **Cause**: The backend is blocking requests from your frontend domain.
- **Fix**: Set `CORS_ALLOWED_ORIGINS=*` or add your exact frontend URL (e.g. `https://my-parking-app.vercel.app`) to the backend environment variables.

#### 2. SPA Route Refresh gives 404 (e.g. on `/dashboard`)
- **Fix on Vercel**: Create a `frontend/vercel.json`:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/" }]
  }
  ```
- **Fix on Nginx/Docker**: The included `nginx.conf` already has `try_files $uri $uri/ /index.html;`.

#### 3. Database Connection Timeout
- Ensure your cloud MySQL instance allows incoming connections (`0.0.0.0/0` IP whitelist or VPC peering).
