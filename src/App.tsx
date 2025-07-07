import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Subscribe from "./pages/Subscribe";
import Contact from "./pages/Contact";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import { SocketProvider } from "./context/SocketContext";
import NotificationListener from "./components/NotificationListener";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <Router>
            <NotificationListener />
            <Layout>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/success" element={<Success />} />
                <Route path="/cancel" element={<Cancel />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/subscribe"
                  element={
                    <ProtectedRoute>
                      <Subscribe />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <ProtectedRoute>
                      <Contact />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
              </Routes>
            </Layout>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "var(--toast-bg)",
                  color: "var(--toast-color)",
                  border: "1px solid var(--toast-border)",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                },
              }}
            />
          </Router>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
