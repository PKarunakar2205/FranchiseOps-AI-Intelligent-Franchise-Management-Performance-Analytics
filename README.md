
# 🚀 FranchiseOps AI

## Intelligent Franchise Management & Performance Analytics

FranchiseOps AI is a full-stack intelligent franchise management platform that transforms operational data into actionable business intelligence, performance insights, risk detection, and management decisions.

---

## 📌 Key Features

- 🤖 AI-powered franchise intelligence
- 📊 Sales and revenue analytics
- 🏪 Outlet performance monitoring
- 🗺️ Real-time outlet location intelligence
- 📦 Inventory monitoring
- 👥 Staff and attendance analytics
- 📢 Marketing campaign and ROI analysis
- 📋 Audit and compliance monitoring
- ⚠️ Risk and alert detection
- 🔔 Notification and workflow management
- 🧠 Franchise health intelligence
- 📈 Executive analytics
- 🎯 AI-driven business recommendations
- 🔎 Outlet drill-down analysis

---

## 🤖 Core Intelligence Modules

### 1. Outlet Performance Agent
Monitors outlet revenue, sales, health score, risk level, and geographic performance.

### 2. Inventory Agent
Analyzes inventory levels, product availability, and stock-related risks.

### 3. Staff Agent
Monitors staff information, attendance, leaves, and workforce performance.

### 4. Marketing Intelligence Agent
Analyzes campaigns, promotions, marketing performance, and ROI.

### 5. Audit & Compliance Intelligence
Tracks audits, compliance scores, evidence, and high-risk outlets.

### 6. Franchise Intelligence Engine
Combines sales, marketing, staff, audit, outlet, and alert data to provide overall franchise health and business insights.

### 7. Notification & Workflow Management
Manages alerts, notifications, action plans, SLA tracking, and escalation workflows.

---

## ⭐ Individual Enhancement — Executive Decision Center

The individual version introduces an executive decision-support layer with:

- Executive KPI summary
- Revenue trend analysis
- Outlet performance scatter plot
- Outlet risk matrix
- AI business recommendations
- Region, outlet, risk, and date filters
- Executive action queue
- Outlet drill-down analysis

### Decision Flow

```text
Business Data
      ↓
Intelligence
      ↓
Analytics
      ↓
Risk Detection
      ↓
AI Recommendation
      ↓
Management Decision
      ↓
Business Action
````

---

## 🏗️ Architecture

```text
                    PostgreSQL
                        │
                        ▼
                   Prisma ORM
                        │
                        ▼
                Node.js + Express
                   REST APIs
                        │
        ┌───────────────┼────────────────┐
        │               │                │
        ▼               ▼                ▼
   Intelligence     Business        Authentication
     Services        Services          & Security
        │               │
        └───────┬───────┘
                ▼
        Executive Decision
             Center
                │
                ▼
          React + Vite
           Dashboard
```

### Data Flow

```text
PostgreSQL
    ↓
Backend Services
    ↓
Intelligence Agents
    ↓
Analytics & Risk Detection
    ↓
AI Recommendations
    ↓
React Dashboard
    ↓
Management Action
```

---

## 🛠️ Technology Stack

### Frontend

* React
* Vite
* React Router
* Recharts
* Leaflet
* Tailwind CSS
* Framer Motion
* Lucide React

### Backend

* Node.js
* Express.js
* REST API
* Prisma ORM
* JWT Authentication

### Database

* PostgreSQL

### Tools

* Git
* GitHub
* Postman
* Jenkins
* Docker
* Antigravity IDE

---

## 📁 Project Structure

```text
FranchiseOps-AI/
│
├── backend/
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── prisma/
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│   │   └── layouts/
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🔐 Authentication

The application uses JWT-based authentication.

```text
Login
  ↓
Credentials Validation
  ↓
JWT Token
  ↓
Protected API
  ↓
Dashboard
```

Sensitive information such as database credentials and JWT secrets is managed through environment variables.

---

## 📊 Business Intelligence

The platform analyzes:

| Area      | Key Insights              |
| --------- | ------------------------- |
| Sales     | Revenue, Orders, Quantity |
| Outlet    | Health, Risk, Performance |
| Inventory | Stock, Availability       |
| Staff     | Attendance, Workforce     |
| Marketing | Campaigns, ROI            |
| Audit     | Compliance, Audit Score   |
| Alerts    | Active & Critical Alerts  |
| Workflow  | Actions, SLA, Escalation  |

---

## 🚀 Local Setup

### Clone Repository

```bash
git clone https://github.com/PKarunakar2205/FranchiseOps-AI-Intelligent-Franchise-Management-Performance-Analytics.git
cd FranchiseOps-AI-Intelligent-Franchise-Management-Performance-Analytics
```

### Backend

```bash
cd backend
npm install
```

Configure environment variables:

```env
DATABASE_URL=your_postgresql_connection
JWT_SECRET=your_secret
PORT=5000
```

Start the backend using the configured project start command.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

### Production Build

```bash
npm run build
npm run preview
```

---

## 🌐 Deployment Architecture

```text
             GitHub
                │
       ┌────────┴────────┐
       │                 │
       ▼                 ▼
    Vercel             Railway
   Frontend            Backend
                          │
                          ▼
                    PostgreSQL
```

---
## 📜 License

This project is licensed under the **FranchiseOps AI Individual Project License**.

Copyright © 2026 P Karunakar.

The project is available for educational, academic, research, and personal
learning purposes. Commercial use, redistribution, or presenting substantial
parts of the project as another person's original work requires prior
permission from the copyright holder.

Third-party libraries and components remain subject to their respective licenses.

## 🎓 Project Context

Developed as part of an **Infosys Springboard internship/project experience** focused on intelligent automation, business analytics, AI-driven insights, and franchise management.

### Individual Developer

**P Karunakar**

### Focus Areas

* Full-Stack Development
* AI & Intelligent Agents
* Business Intelligence
* Data Analytics
* Performance Monitoring
* Risk Detection
* Decision Support
* Workflow Automation

---

## 🔮 Future Enhancements

* Predictive sales forecasting
* Inventory demand prediction
* Advanced anomaly detection
* Automated reporting
* Advanced AI recommendations
* Real-time event processing
* Mobile application


