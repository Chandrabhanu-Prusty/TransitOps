import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
  Outlet,
  Link,
} from 'react-router-dom';
import DashboardApp from './app/DashboardApp';
import './styles/index.css';
import { authService } from './app/services/authService';

// ─── Protected Route ──────────────────────────────────────────────────────────

function ProtectedRoute() {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

// ─── 404 Page ─────────────────────────────────────────────────────────────────

function NotFoundPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      color: '#0f172a',
      fontFamily: 'Inter, sans-serif',
    }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 700 }}>404</h1>
      <p style={{ color: '#64748b' }}>Page not found</p>
      <Link to="/dashboard" style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px 16px',
        borderRadius: '8px',
        background: '#2563eb',
        color: '#fff',
        textDecoration: 'none',
        fontWeight: 500,
      }}>Back to Dashboard</Link>
    </div>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────

const router = createBrowserRouter([
  // Public routes
  { path: '/login',    element: <DashboardApp initialPage="login" /> },
  { path: '/register', element: <DashboardApp initialPage="register" /> },

  // Protected routes – all under ProtectedRoute guard
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/',            element: <Navigate to="/dashboard" replace /> },
      { path: '/dashboard',   element: <DashboardApp initialPage="dashboard" /> },
      { path: '/vehicles',    element: <DashboardApp initialPage="vehicles" /> },
      { path: '/drivers',     element: <DashboardApp initialPage="drivers" /> },
      { path: '/dispatch',    element: <DashboardApp initialPage="dispatch" /> },
      { path: '/maintenance', element: <DashboardApp initialPage="maintenance" /> },
      { path: '/fuel',        element: <DashboardApp initialPage="fuel" /> },
      { path: '/reports',     element: <DashboardApp initialPage="reports" /> },
      { path: '/settings',    element: <DashboardApp initialPage="settings" /> },
    ],
  },

  { path: '*', element: <NotFoundPage /> },
]);

// ─── Query Client ─────────────────────────────────────────────────────────────

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 5,
    },
  },
});

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
