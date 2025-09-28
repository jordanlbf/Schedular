import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { routeConfig } from "./routes";
import { LoadingFallback } from "./LoadingFallback";

export function AppRouter() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {routeConfig.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<route.component />}
          />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
