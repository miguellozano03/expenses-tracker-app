import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout, AuthLayout, AppLayout } from "@/layouts";

import { Login, Register, Profile } from "@/pages/auth";
import { ListExpenses, CreateExpense } from "@/pages/expenses";
import { DashboardHome, Charts } from "@/pages/Dashboard";

import { ProtectedRoute } from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    element: <RootLayout />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/register",
            element: <Register />,
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              { path: "/home", element: <DashboardHome /> },
              { path: "/charts", element: <Charts /> },
              { path: "/create", element: <CreateExpense /> },
              { path: "/expenses", element: <ListExpenses /> },
              { path: "/profile", element: <Profile /> },
            ],
          },
        ],
      },
    ],
  },
]);
