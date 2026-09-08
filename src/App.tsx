import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Subscribe from './pages/Subscribe'
import Contact from './pages/Contact'
import Success from './pages/Success'
import Cancel from './pages/Cancel'
import Profile from './pages/Profile'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import Security from './pages/Security'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/success" element={<Success />} />
              <Route path="/cancel" element={<Cancel />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/security" element={<Security />} />
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
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Layout>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
                border: 'none',
                borderRadius: '9999px',
                fontSize: '0.8125rem',
                fontWeight: 700,
                padding: '0.875rem 1.5rem',
                boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.35)',
              },
              success: {
                iconTheme: {
                  primary: '#16a34a',
                  secondary: 'var(--toast-bg)',
                },
              },
              error: {
                iconTheme: {
                  primary: '#dc2626',
                  secondary: 'var(--toast-bg)',
                },
              },
            }}
          />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App