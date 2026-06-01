import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { ProtectedRoute } from "./ProtectedRoute";

import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";
import { AppLayout } from "../layouts/AppLayout";
import { ListExpenses } from "../pages/expenses/List";
import { CreateExpense } from "../pages/expenses/Create";
import { Profile } from "../pages/auth/Profile";
import { DashboardHome } from "../pages/Dashboard/Home";
import { Charts } from "../pages/Dashboard/Charts";

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
