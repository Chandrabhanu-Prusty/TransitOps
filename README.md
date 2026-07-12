# 🚛 TransitOps — Smart Transport Operations Platform

TransitOps is a premium, enterprise-grade Smart Transport Operations Platform designed to streamline logistics, fleet scheduling, fuel logging, and vehicle maintenance workflow management. 

Built as a monorepo utilizing NPM Workspaces, the platform integrates a high-performance Express REST API backend with a responsive React UI.

---

## ✨ Features

### 1. 📊 Real-Time Analytics Dashboard
- Dynamic KPI metrics displaying **Active Vehicles**, **Available Vehicles**, **Active Trips**, and **Drivers on Duty**.
- Interactive charts utilizing **Recharts** for visualizing monthly operational costs, fuel efficiency, and vehicle ROI metrics.

### 2. 🔐 Role-Based Access Control (RBAC)
- Strict authentication flow utilizing JWT authorization tokens.
- Dynamic permission toggles for four distinct roles:
  - **Fleet Administrator**: Unlimited system-wide actions.
  - **Fleet Manager**: Driver/vehicle/trip coordination permissions.
  - **Dispatcher**: Read-only tracking with trip dispatch privileges.
  - **Viewer**: Entirely read-only monitoring access.
- Dark-themed **Logout Confirmation Modal** prevents accidental session closures.

### 3. 🚛 Advanced Fleet & Driver CRUD
- Fully managed state screens for registering new vehicles (model, capacity, odometer, status).
- Driver profiles showing safety scores, license expirations, and status toggles.

### 4. 🗺️ Intelligent Trip Management
- Advanced validation flow when designing routes:
  - **Weight capacity check:** Blocks cargo weight exceeding maximum vehicle capacity.
  - **License expiration check:** Restricts dispatching if driver license is expired.
  - **Availability checking:** Restricts matching unavailable vehicles or drivers.

### 5. ⚙️ Automatic Status Transitions
- Transactional state transitions executing Prisma DB updates:
  - **Dispatching:** Set trip to `dispatched` while simultaneously transitioning both driver and vehicle status to `on_trip`.
  - **Completion:** Updates vehicle odometer, moves driver and vehicle back to `available`, and automatically writes a `FuelLog` entry based on consumed volume.
  - **Cancellation:** Releases driver and vehicle immediately to `available`.

### 6. 🔧 Maintenance Workflow
- Logging active and scheduled service actions for specific vehicles.
- Custom premium **Service Closure Modal** prompt for marking maintenance tasks as complete, prompting the technician to finalize logs and returning the vehicle to `available`.

### 7. ⛽ Fuel & Expense Tracking
- Form entry for logging gas refills and other toll/operational expenses against specific vehicles, which recalculates cost analytics on the fly.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, TypeScript, TanStack React Query, Tailwind CSS v4, Lucide Icons, Recharts |
| **Backend** | Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, Zod (Validation) |

---

## 📁 Project Structure

```text
TransitOps/
├── frontend/             # React SPA Frontend
│   ├── src/
│   │   ├── app/          # Dashboard screens, hooks, and views
│   │   ├── lib/          # Global client auth modules and state
│   │   ├── services/     # Axios API service instances
│   │   ├── App.tsx       # Router configuration & Query setup
│   │   └── main.tsx      # DOM Entrypoint
│   └── vite.config.ts    # Bundler config
│
├── backend/              # Express REST API Backend
│   ├── src/
│   │   ├── modules/      # Core API domains (Auth, Fuel, Expense, Trips, etc.)
│   │   ├── middleware/   # JWT verification and RBAC middleware
│   │   ├── prisma/       # Database configuration schema
│   │   └── index.ts      # Express entry point
│   └── tsconfig.json     # Compiler settings
```

---

## 🚀 Getting Started

From the root directory:

### Step 1: Install Dependencies
```bash
npm install --legacy-peer-deps
```

### Step 2: Configure Environment Variables
Create `.env` files in both directories according to their `.env.example` templates:

**Backend (`backend/.env`):**
```env
PORT=5000
DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<db_name>?schema=public"
JWT_SECRET="your_jwt_secret_key"
```

**Frontend (`frontend/.env`):**
```env
VITE_API_BASE_URL="http://localhost:5000/api"
```

### Step 3: Run DB Migrations
Generate Prisma Client and push schemas to your PostgreSQL server:
```bash
cd backend
npx prisma db push
```

### Step 4: Run Dev Servers
From the root directory, launch the developer environments concurrently:
```bash
# Starts Express API and React Dev servers
npm run dev
```
*(Or run separately with `npm run dev:backend` and `npm run dev:frontend`)*
