import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { setNavigate } from "@/hooks/useNavigateRef";

export function RootLayout() {
  const nav = useNavigate();
  useEffect(() => setNavigate(nav), [nav]);
  return <Outlet />;
}
