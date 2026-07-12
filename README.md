# TransitOps 🚌

TransitOps is a modern, premium enterprise fleet management platform designed to streamline transport operations, track vehicle registry inventory, monitor driver performance and compliance, schedule vehicle maintenance, log fuel/operational expenses, and analyze key business metrics.

---

## 🛠️ Technology Stack

### Backend
* **Runtime & Framework**: Node.js with Express.js
* **Language**: TypeScript
* **Database & ORM**: PostgreSQL with Prisma ORM
* **Security & Auth**: JSON Web Tokens (JWT) & bcryptjs hashing
* **Validation**: Zod schema validation

### Frontend
* **Build System**: Vite
* **Library**: React 19 (TypeScript)
* **Styling**: Vanilla CSS (Global & modular theme presets)
* **State Management & Queries**: Tanstack React Query (v5)
* **Router**: React Router DOM (v7)
* **Icons**: Lucide React
* **Charts**: Recharts

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* PostgreSQL running locally or remotely

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your environmental variables in a `.env` file:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<db_name>?schema=public"
   JWT_SECRET="your-super-secret-jwt-key"
   CORS_ORIGIN="http://localhost:5173"
   ```
4. Run migrations and database seeds:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
   * *API will be hosted on: http://localhost:5000*
   * *API health status: http://localhost:5000/health*

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the Vite dev proxy if custom ports are needed (configured to port `5000` by default in `vite.config.ts`).
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   * *App will be hosted on: http://localhost:5173*

---

## 🔐 Auth Roles & Seed Credentials
Authentication enforces Role-Based Access Control (RBAC). The database includes pre-seeded roles you can log in with:

| Role | Username | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Fleet Manager** | `manager@transitops.com` | `Password123` | Full access + Register new users / Manage maintenance logs |
| **Driver** | `driver@transitops.com` | `Password123` | View assigned trips (Reports/Settings denied) |
| **Safety Officer** | `safety@transitops.com` | `Password123` | Monitor driver compliance metrics (Reports/Settings denied) |
| **Financial Analyst** | `analyst@transitops.com` | `Password123` | View revenue, fuel costs, ROI, and expenses |

---

## 📂 Project Architecture

```
TransitOps/
├── backend/
│   ├── src/
│   │   ├── prisma/             # Prisma database schema & seeds
│   │   ├── middleware/         # Auth & error handling middlewares
│   │   ├── modules/            # Domain-driven backend routers & services
│   │   └── index.ts            # App entrypoint (Express instance)
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/     # Protected route guards & UI primitives
│   │   │   ├── hooks/          # React Query hooks (useVehicles, etc)
│   │   │   ├── pages/          # Login & registration pages
│   │   │   ├── services/       # Axios API client (api.ts, auth.service.ts)
│   │   │   └── DashboardApp.tsx# Main dashboard application
│   │   ├── lib/
│   │   │   └── auth.tsx        # AuthProvider context
│   │   └── App.tsx             # React entrypoint (Router provider)
```
