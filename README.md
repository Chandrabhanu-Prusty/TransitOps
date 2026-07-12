# TransitOps – Smart Transport Operations Platform

Welcome to the development repository for **TransitOps**, a Smart Transport Operations Platform built to streamline logistics, fleets, trip dispatches, and driver management.

This project is structured as a **monorepo** using npm workspaces.

---

## 📁 Project Structure

```
TransitOps/
├── frontend/             # Vite + React + TypeScript + Tailwind CSS v4
│   ├── src/
│   │   ├── app/          # Dashboard application pages, UI primitives, and components
│   │   ├── lib/          # Global client singletons (e.g., Supabase client)
│   │   ├── styles/       # Tailwind CSS v4 configuration, theme, and fonts
│   │   ├── App.tsx       # Root App router & TanStack Query wrapper
│   │   └── main.tsx      # DOM Entrypoint
│   ├── .env.example      # Template for frontend environment variables
│   ├── eslint.config.js  # ESLint configuration
│   └── vite.config.ts    # Vite bundler configuration (with proxy and path alias settings)
│
├── backend/              # Node.js + Express + TypeScript + Prisma ORM
│   ├── prisma/
│   │   └── schema.prisma # Prisma Schema for PostgreSQL
│   ├── src/
│   │   ├── lib/          # DB connections and Supabase Admin helper singletons
│   │   ├── index.ts      # Express application entrypoint (Health and core routes)
│   │   └── types/        # Custom TypeScript typings
│   ├── .env.example      # Template for backend environment variables
│   ├── eslint.config.js  # ESLint configuration
│   └── tsconfig.json     # Backend TypeScript compiler settings
│
├── package.json          # Root Monorepo configuration (npm workspaces setup)
└── README.md             # Project documentation (this file)
```

---

## 🛠 Prerequisites

Before starting, ensure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher recommended)
- A **PostgreSQL database instance** (either running locally or hosted on [Supabase](https://supabase.com))
- A **Supabase Project** (for authentication and database hosting)

---

## 🚀 Getting Started

Follow these step-by-step instructions to get the platform up and running locally.

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd TransitOps
```

### Step 2: Install Monorepo Dependencies
From the repository root, install dependencies for both the frontend and backend using `npm install`.
> [!IMPORTANT]
> Because the project runs on **React 19** with various third-party peer packages (such as Recharts and Material UI), you **must** use the `--legacy-peer-deps` flag during installation to prevent peer conflict issues.
```bash
npm install --legacy-peer-deps
```

### Step 3: Configure Environment Variables
You need to copy the `.env.example` templates and fill in your local development variables.

#### 1. Backend Environment Setup
Copy the example file in the `backend/` directory:
```bash
cp backend/.env.example backend/.env
```
Open `backend/.env` and update the values:
- `DATABASE_URL`: Your PostgreSQL connection string. (e.g., `postgresql://postgres:password@localhost:5432/transitops?schema=public`)
- `SUPABASE_URL` & `SUPABASE_SERVICE_ROLE_KEY`: Service credentials found in your Supabase project dashboard settings.
- `JWT_SECRET`: Secret key used for signing JWTs (must match Supabase's JWT secret).

#### 2. Frontend Environment Setup
Copy the example file in the `frontend/` directory:
```bash
cp frontend/.env.example frontend/.env
```
Open `frontend/.env` and update the values:
- `VITE_API_BASE_URL`: Base backend API address. (Defaults to `http://localhost:3001` in local development).
- `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`: Client-safe credentials found in your Supabase dashboard settings.

### Step 4: Generate the Prisma Client
To generate the Prisma Client types used in the backend code, run the following command from the repository root:
```bash
npm run db:generate --workspace=backend
```

### Step 5: Start Development Servers
You can run the frontend and backend concurrently or run them individually.

#### Running Concurrently (Recommended)
From the root directory:
```bash
npm run dev
```

#### Running Individually
* **Backend Dev Server** (starts on port `3001`):
  ```bash
  npm run dev:backend
  ```
* **Frontend Dev Server** (starts on port `5173`):
  ```bash
  npm run dev:frontend
  ```

---

## 🔍 Verification

Once the development servers have launched, verify the environment:
1. Open **[http://localhost:5173](http://localhost:5173)** in your browser.
2. The login screen should load successfully.
3. Use the credentials:
   - **Email**: `admin@transitops.com`
   - **Password**: `Password1234`
4. Once logged in, check the top navigation header next to the search bar. You should see a green **`API ok`** badge. This indicates the frontend successfully resolved the backend `/health` endpoint query.
5. You can manually inspect the backend health response directly at **[http://localhost:3001/health](http://localhost:3001/health)**.

---

## ⚡ Tech Stack Details

| Layer | Technologies Used |
|---|---|
| **Frontend Core** | React (v19.2), Vite (v8.1), TypeScript |
| **Styling** | Tailwind CSS v4 (CSS-first config), Radix UI Primitives, Lucide Icons |
| **Routing** | React Router v7 |
| **State / Data fetching** | TanStack React Query v5 |
| **Form Handling / Validation** | React Hook Form, Zod |
| **Backend API** | Node.js, Express, TypeScript |
| **Database ORM** | Prisma v6 (PostgreSQL) |
| **Auth & Storage** | Supabase |
| **Code Quality** | ESLint, Prettier |

---

## 🧹 Code Quality

Run code quality tasks across workspaces using root scripts:

```bash
# Check code using ESLint rules
npm run lint

# Format code files using Prettier
npm run format
```