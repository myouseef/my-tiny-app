// src/components/RequireAuth.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function RequireAuth() {
  const token = localStorage.getItem("auth_token");
  // يمكنك هنا فك تشفير التوكن والتحقق من exp إن أردت
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
