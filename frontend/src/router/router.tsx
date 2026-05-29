import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import { AuthLayout } from "../layouts/AuthLayout";

import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";
import { MobileLayout } from "../layouts/MobileLayout";
import { ListExpenses } from "../pages/expenses/List";
import { CreateExpense } from "../pages/expenses/Create";
import { Profile } from "../pages/auth/Profile";
import { DashboardHome } from "../pages/Dashboard/Home";
import { Charts } from "../pages/Dashboard/Charts";

export const router = createBrowserRouter([
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
        element: <MobileLayout />,
        children: [
          { path: "/home", element: <DashboardHome /> },
          { path: "/charts", element: <Charts /> },
          { path: "/create", element: <CreateExpense /> },
          { path: "/reports", element: <ListExpenses /> },
          { path: "/profile", element: <Profile /> },
        ],
      },
    ],
  },
]);
