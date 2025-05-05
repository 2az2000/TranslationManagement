import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { TranslationProvider } from "./context/TranslationContext";
import Layout from "./components/Layout";
import Loader from "./components/Loader";
import NotFound from "./pages/NotFound";
import "./App.css";

const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const PublicView = React.lazy(() => import("./pages/PublicView"));

export default function App() {
  return (
    <TranslationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route
              path="dashboard"
              element={
                <Suspense fallback={<Loader />}>
                  <Dashboard />
                </Suspense>
              }
            />
            <Route
              path="public"
              element={
                <Suspense fallback={<Loader />}>
                  <PublicView />
                </Suspense>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </TranslationProvider>
  );
}
