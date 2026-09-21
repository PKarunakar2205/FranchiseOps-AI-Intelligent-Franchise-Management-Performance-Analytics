🚀 FranchiseOps AI
## Intelligent Franchise Management & Performance Analytics

> An AI-powered full-stack franchise management platform that transforms franchise operational data into business intelligence, performance insights, risk detection, recommendations, notifications, workflows, and executive decision support.

---

## 📌 Project Overview

**FranchiseOps AI** is an intelligent franchise management system designed to provide a centralized view of franchise operations.

The platform brings together:

- Outlet performance
- Sales and revenue
- Inventory
- Staff operations
- Marketing campaigns
- Audits and compliance
- Franchise health
- Alerts
- Notifications
- Workflow escalation
- Executive analytics
- AI-driven business recommendations
- Geographic outlet intelligence

The system follows the business flow:

```text
Business Data
      ↓
Data Processing
      ↓
Intelligence Agents
      ↓
Analytics & Risk Detection
      ↓
AI Recommendations
      ↓
Management Decision
      ↓
Business Action
      ↓
Monitoring & Workflow
🎯 Project Objective

The main objective of FranchiseOps AI is to convert raw franchise operational data into meaningful, actionable intelligence.

The platform is designed to help management:

Monitor outlet performance
Understand revenue and sales trends
Identify high-risk outlets
Monitor inventory conditions
Analyze staff attendance and workforce information
Measure marketing campaign performance
Track audit and compliance status
Evaluate overall franchise health
Detect operational alerts
Generate business recommendations
Assign and track corrective actions
Escalate unresolved issues
Support executive decision making
🧩 Core Modules

The system contains seven major intelligence and operations modules.

1. Outlet Performance Agent

The Outlet Performance Agent monitors the performance and operational health of franchise outlets.

Main Functions
Outlet revenue analysis
Sales and transaction analysis
Outlet health scoring
Risk classification
Outlet comparison
Regional performance analysis
City/state filtering
Outlet search
Real-time outlet location intelligence
Outlet-level performance details
Outlet Intelligence Flow
Sales Data
    ↓
Revenue Analysis
    ↓
Outlet Performance
    ↓
Health Score
    ↓
Risk Classification
    ↓
Management Action
Outlet Risk Levels
Critical
   ↓
High
   ↓
Medium
   ↓
Low
   ↓
Healthy
Geographic Outlet Intelligence

The application provides a map-based outlet intelligence view using actual outlet information.

The map supports:

Outlet markers
Outlet names
Outlet IDs
City
State
Revenue
Health information
Risk information
Search
Region/state/city filtering
Risk filtering
2. Inventory Agent

The Inventory Agent monitors product and outlet inventory conditions.

Main Functions
Inventory monitoring
Stock-level analysis
Product-level visibility
Low-stock identification
Outlet inventory analysis
Inventory availability indicators
Inventory-related business insights
Inventory Flow
Inventory Data
      ↓
Stock Analysis
      ↓
Availability Check
      ↓
Low Stock / Risk Detection
      ↓
Business Action
3. Staff Agent

The Staff Agent provides workforce and staff-operation intelligence.

Main Functions
Staff monitoring
Attendance analysis
Leave tracking
Workforce visibility
Staff performance indicators
Operational workforce insights
Staff Intelligence Flow
Staff Data
    ↓
Attendance Analysis
    ↓
Leave Analysis
    ↓
Workforce Insights
    ↓
Operational Decision
4. Marketing Intelligence Agent

The Marketing Intelligence Agent evaluates campaigns and promotions.

Main Functions
Marketing campaign analysis
Campaign performance
Marketing ROI
Promotion monitoring
Campaign comparison
Marketing effectiveness insights
Marketing Intelligence Flow
Campaign Data
      ↓
Campaign Performance
      ↓
Revenue / Impact Analysis
      ↓
ROI Calculation
      ↓
Marketing Insight
      ↓
Management Decision
5. Audit & Compliance Intelligence

The Audit & Compliance Intelligence module monitors audit performance and compliance.

Main Functions
Audit monitoring
Compliance analysis
Audit score tracking
Audit evidence tracking
Risk identification
High-risk outlet detection
Compliance insights
Compliance Flow
Audit Data
     ↓
Audit Evaluation
     ↓
Compliance Score
     ↓
Risk Detection
     ↓
Corrective Action
6. Franchise Intelligence Engine

The Franchise Intelligence Engine combines operational information from multiple business areas.

Inputs
Revenue
Sales
Marketing
Staff
Audit
Compliance
Outlet health
Alerts
Operational indicators
Intelligence Flow
Sales
  +
Marketing
  +
Staff
  +
Audit
  +
Outlet Performance
  +
Alerts
      ↓
Franchise Intelligence Engine
      ↓
Health & Risk Analysis
      ↓
Business Recommendations
      ↓
Management Action
Franchise Health

The engine combines operational indicators to provide a consolidated view of franchise performance and risk.

7. Notification & Workflow Management

The Notification & Workflow Management module converts business events into notifications, action plans, and escalation workflows.

Notification Channels
Email
SMS
Mobile Push
In-App
Priority Levels
Low
Medium
High
Critical
Notification Architecture
Business Event
      ↓
Notification Engine
      ↓
Channel Router
      ↓
User / Manager
Escalation Workflow
Issue Created
      ↓
Owner Notified
      ↓
No Response
      ↓
Manager Escalation
      ↓
Regional Escalation
Action Plan
Identify Issue
      ↓
Assign Owner
      ↓
Set Deadline
      ↓
Track Progress
      ↓
Verify & Close
Workflow Metrics

The workflow architecture supports tracking concepts such as:

Notifications Sent
Acknowledgement Rate
Open Actions
SLA Breaches
Resolution Time
Escalation status
Audit trail
⭐ Individual Enhancement: Executive Decision Center

The individual version introduces an Executive Decision Center for management-level analytics and decision support.

This layer combines operational telemetry and intelligence outputs into a single executive interface.

Executive Decision Center Features
1. Executive KPI Summary

Provides high-level business indicators such as:

Total Revenue
Total Orders
Average Outlet Health
Active Alerts
2. Time-Series Revenue Trend

Provides interactive revenue trend visualization.

Revenue
  │
  │          ╭──╮
  │      ╭───╯  ╰──╮
  │  ╭───╯         ╰──
  └──────────────────────→ Time
3. Outlet Performance Scatter Plot

Visualizes:

Revenue
   VS
Health Score

This allows management to inspect relationships between outlet business performance and outlet health.

4. Outlet Risk Matrix

Outlets are organized into:

Critical
High
Medium
Low
Healthy

The matrix provides an executive view of operational risk distribution.

5. Telemetry-Driven AI Business Recommendations

Recommendations are derived from operational/business telemetry such as:

Revenue
Outlet health
Risk levels
Audit information
Staff information
Inventory conditions
Marketing performance
Alerts
6. Global Filters

The Executive Decision Center supports filtering by:

Region
Outlet
Risk Level
Date Range
7. Executive Action Queue

The action queue connects identified business issues with notification and workflow actions.

8. Outlet Drill-Down

The executive interface provides detailed outlet information including:

Revenue
Health score
Risk
Audit information
Staff information
Inventory information
Alerts
🏗️ Complete System Architecture
                         ┌──────────────────────────┐
                         │       PostgreSQL         │
                         │      Business Data       │
                         └────────────┬─────────────┘
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │     Prisma ORM Layer     │
                         │     Database Access      │
                         └────────────┬─────────────┘
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │    Node.js + Express     │
                         │       REST API           │
                         └────────────┬─────────────┘
                                      │
              ┌───────────────────────┼────────────────────────┐
              │                       │                        │
              ▼                       ▼                        ▼
      ┌───────────────┐      ┌────────────────┐      ┌────────────────┐
      │ Authentication│      │ Business       │      │ Intelligence   │
      │ & Middleware  │      │ Services       │      │ Services       │
      └───────────────┘      └────────────────┘      └───────┬────────┘
                                                              │
                         ┌────────────────────────────────────┼────────────────────────┐
                         │            │            │           │          │             │
                         ▼            ▼            ▼           ▼          ▼             ▼
                    Outlet       Inventory      Staff     Marketing    Audit       Franchise
                    Agent          Agent        Agent     Intelligence Intelligence Intelligence
                         │            │            │           │          │             │
                         └────────────┴────────────┴───────────┴──────────┴─────────────┘
                                                              │
                                                              ▼
                                                    ┌──────────────────┐
                                                    │ Notification &   │
                                                    │ Workflow Engine  │
                                                    └────────┬─────────┘
                                                             │
                                                             ▼
                                                    ┌──────────────────┐
                                                    │ Executive        │
                                                    │ Decision Center  │
                                                    └────────┬─────────┘
                                                             │
                                                             ▼
                                                    ┌──────────────────┐
                                                    │ React + Vite     │
                                                    │ Web Dashboard    │
                                                    └──────────────────┘
🔄 End-to-End Data Flow
PostgreSQL
    ↓
Prisma
    ↓
Backend Services
    ↓
REST API
    ↓
Intelligence Modules
    ↓
Analytics
    ↓
Risk Detection
    ↓
AI Recommendations
    ↓
React Dashboard
    ↓
Management Decision
    ↓
Notification / Workflow
    ↓
Action & Escalation
🖥️ Frontend Architecture

The frontend is built using React and Vite.

Frontend Technologies
React
Vite
React Router
Recharts
Leaflet
Lucide React
Framer Motion
Tailwind CSS
Frontend Responsibilities

The frontend provides:

Dashboard interfaces
Module navigation
KPI cards
Charts
Graphs
Tables
Filters
Maps
Risk indicators
AI recommendation cards
Action queues
Drill-down views
Authentication UI
Settings and user interactions
📊 Visualization Layer

The project uses multiple visualization patterns.

KPI Cards

Used for:

Revenue
Orders
Outlet health
Alerts
Inventory
Audit
Staff
Marketing
Charts

The platform uses interactive charts for:

Revenue trends
Sales performance
Outlet comparison
Scatter analysis
Performance analytics
Executive analytics
Risk Visualization
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│ Critical │   High   │  Medium  │   Low    │ Healthy  │
└──────────┴──────────┴──────────┴──────────┴──────────┘
Geographic Visualization

The Outlet Performance module uses map-based visualization for outlet locations and outlet intelligence.

🗺️ Outlet Location Intelligence

The location intelligence component provides:

Real outlet names
Outlet identifiers
City/state information
Geographic markers
Revenue information
Health information
Risk information
Search
Filters

Conceptual flow:

Outlet Database
      ↓
Outlet Location
      ↓
Map Marker
      ↓
Outlet Intelligence
      ↓
Performance / Risk Details
🔐 Authentication & Authorization

The backend uses JWT-based authentication.

Authentication Flow
User
 ↓
Login
 ↓
Credentials Validation
 ↓
JWT Token
 ↓
Authenticated Request
 ↓
JWT Middleware
 ↓
Protected API
 ↓
Response
Security Components
JWT authentication
Protected API routes
Environment variables
Database credentials outside source code
.env excluded from Git
Production secrets managed through hosting environment variables
⚙️ Backend Architecture

The backend follows a layered architecture.

Routes
  ↓
Controllers
  ↓
Services
  ↓
Prisma
  ↓
PostgreSQL
Routes

Responsible for defining API endpoints.

Controllers

Responsible for:

Request handling
Authentication context
Validation
Calling services
Sending API responses
Services

Responsible for:

Business logic
Analytics
Intelligence calculations
Recommendations
Database operations
Workflow processing
Middleware

Responsible for concerns such as:

Authentication
Protected requests
Request processing
🗄️ Database Architecture

The application uses PostgreSQL as the relational database and Prisma as the ORM/data-access layer.

The project works with operational data areas including:

Users
Outlets
Sales
Products
Inventory
Staff
Leaves
Audits
Audit Evidence
Marketing Campaigns
Promotions
Alerts
Notifications
Workflows / Actions
Database Intelligence Flow
PostgreSQL Tables
      ↓
Prisma Models
      ↓
Backend Services
      ↓
Analytics & Intelligence
      ↓
REST APIs
      ↓
Frontend
🔌 REST API Architecture

The frontend communicates with the backend through REST APIs.

React UI
   ↓
API Client
   ↓
HTTP Request
   ↓
Express Route
   ↓
Controller
   ↓
Service
   ↓
Prisma
   ↓
PostgreSQL

Authentication-protected endpoints use the JWT authorization token.

📦 Project Structure
FranchiseOps-AI-Intelligent-Franchise-Management-Performance-Analytics/
│
├── backend/
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── package.json
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
🧱 Important Frontend Components

The individual enhancement includes executive and command-center components such as:

AgentModuleCard
AiDecisionCard
CommandBar
CommandSidebar
ExecutiveKpiCard
OutletDrillDownModal
OutletLocationMap

These components support the command-center and executive analytics experience.

🧠 Intelligence Verification

The project includes backend intelligence verification covering areas such as:

Authentication
Intelligence API
Revenue
Transactions
Marketing ROI
Staff attendance
Audit compliance
High-risk outlets
Active alerts
Outlet health matrix
Regional sales
Business recommendations
Alert generation
Outlet details

The Executive Decision Center verification also covers:

Backend startup
Endpoint authentication
PostgreSQL data access
Dynamic executive KPIs
Revenue time series
Outlet scatter data
Risk matrix
Telemetry-driven recommendations
Global filters
Action queue
Outlet drill-down
Existing intelligence modules
Authentication
Notification/workflow integration
Production frontend build
🧪 Testing & Verification

The project uses verification scripts and production-build testing to validate major functionality.

Important verification areas include:

Authentication                 ✓
Intelligence APIs              ✓
Revenue Analytics              ✓
Transaction Analytics          ✓
Marketing ROI                  ✓
Staff Attendance                ✓
Audit Compliance                ✓
Outlet Risk                     ✓
Active Alerts                   ✓
Outlet Health Matrix            ✓
Business Recommendations        ✓
Notification Workflow           ✓
Executive Decision Center       ✓
Global Filters                  ✓
Outlet Drill-Down               ✓
Frontend Production Build       ✓
🛠️ Development Tools

The project development workflow uses:

Git
GitHub
npm
VS Code / Antigravity IDE
Postman
Jenkins
Docker
🚀 Local Setup
Prerequisites

Install:

Node.js
npm
PostgreSQL
Git
1. Clone Repository
git clone https://github.com/PKarunakar2205/FranchiseOps-AI-Intelligent-Franchise-Management-Performance-Analytics.git

cd FranchiseOps-AI-Intelligent-Franchise-Management-Performance-Analytics
2. Backend Installation
cd backend
npm install

Configure backend environment variables in .env.

Example:

DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000

Never commit .env or production credentials to GitHub.

3. Start Backend

Use the backend project's configured production/development command.

The local backend commonly runs on:

http://localhost:5000
4. Frontend Installation

Open another terminal:

cd frontend
npm install

Start the frontend:

npm run dev

Typical development URL:

http://localhost:5173
🏭 Production Frontend Testing

Build the frontend:

cd frontend
npm run build

Preview the production build:

npm run preview

Typical Vite preview URL:

http://localhost:4173

This production-preview step is useful for verifying that charts, maps, routes, API calls, and frontend components also work in the production build.

🌐 Deployment Architecture

The individual project can be deployed using separate frontend and backend services.

                         GitHub
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
          Vercel                     Railway
          Frontend                    Backend
                                        │
                                        ▼
                                  PostgreSQL
Frontend
React + Vite
    ↓
Vercel
Backend
Node.js + Express
    ↓
Railway
Database
PostgreSQL
    ↓
Railway PostgreSQL
Production Request Flow
User Browser
      ↓
Vercel Frontend
      ↓ HTTPS
Railway Backend
      ↓
Prisma
      ↓
PostgreSQL

Environment variables should be configured through the hosting platforms rather than committed to GitHub.

🔒 Environment & Secret Management

The repository intentionally excludes sensitive environment files.

Examples of values that should remain outside Git:

DATABASE_URL
JWT_SECRET
Production API credentials
Database passwords
Other private environment variables

Use environment variables in local and production environments.

📈 Business Intelligence Example

A management scenario can flow through the platform as follows:

Outlet Sales Decrease
        ↓
Revenue Trend Detection
        ↓
Outlet Health Reduction
        ↓
Risk Classification
        ↓
AI Business Recommendation
        ↓
Action Queue
        ↓
Owner Assignment
        ↓
Notification
        ↓
Escalation if Required
        ↓
Resolution
        ↓
Verification

This connects analytics with operational action instead of stopping at visualization.

🔔 Alert & Workflow Lifecycle
Business Event
      ↓
Alert Generated
      ↓
Priority Assigned
      ↓
Notification Sent
      ↓
Owner Acknowledgement
      ↓
Action Plan
      ↓
Deadline
      ↓
Progress Tracking
      ↓
SLA Monitoring
      ↓
Escalation
      ↓
Resolution
      ↓
Verification
      ↓
Closure
📊 Executive Analytics Layer

The executive layer provides a consolidated view of:

Revenue
Sales
Outlet Health
Risk
Inventory
Staff
Marketing
Audit
Alerts
Actions

These inputs are transformed into:

Executive KPIs
      +
Charts
      +
Risk Matrix
      +
Recommendations
      +
Action Queue
      +
Outlet Drill-Down
🎯 Decision-Support Model

FranchiseOps AI is structured around:

OBSERVE
   ↓
ANALYZE
   ↓
UNDERSTAND
   ↓
RECOMMEND
   ↓
ACT
   ↓
MONITOR
Observe

Collect business and operational information.

Analyze

Calculate metrics and identify trends.

Understand

Identify risks, performance patterns, and operational conditions.

Recommend

Generate business recommendations based on telemetry and intelligence.

Act

Create actions, notifications, and workflows.

Monitor

Track progress, escalation, SLA, and resolution.

🎓 Project Context

This project was developed in the context of an Infosys Springboard internship/project experience focused on intelligent automation, analytics, and AI-driven franchise management.

The individual repository contains the franchise management platform together with additional executive-level analytics and decision-support enhancements.

👨‍💻 Individual Project

Developer: P Karunakar

Project: FranchiseOps AI – Intelligent Franchise Management & Performance Analytics

Focus Areas
Full-Stack Development
Artificial Intelligence
Agentic Business Intelligence
Data Analytics
Business Intelligence
Performance Monitoring
Risk Detection
Decision Support
Workflow Automation
REST API Development
Database Management
🔮 Future Enhancements

Potential future improvements include:

Predictive sales forecasting
Inventory demand prediction
Advanced anomaly detection
Automated business forecasting
Advanced recommendation models
Automated report generation
Mobile application
Additional notification integrations
Role-specific executive dashboards
Expanded AI agent orchestration
Real-time event streaming
Advanced predictive risk scoring
📜 License

This project is intended for educational, internship, demonstration, and portfolio purposes.

⭐ Acknowledgements
Infosys Springboard
React
Vite
Node.js
Express.js
PostgreSQL
Prisma
Recharts
Leaflet
Tailwind CSS
Framer Motion
Lucide React
GitHub
Open-source community
📌 Repository

GitHub Repository:

https://github.com/PKarunakar2205/FranchiseOps-AI-Intelligent-Franchise-Management-Performance-Analytics

🚀 FranchiseOps AI
Business Data
      ↓
Intelligence
      ↓
Analytics
      ↓
Risk Detection
      ↓
AI Recommendations
      ↓
Decision
      ↓
Action
      ↓
Continuous Monitoring
