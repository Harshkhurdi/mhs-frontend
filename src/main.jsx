import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { RFQProvider } from './components/RFQContext'
import { AuthProvider } from './context/AuthContext'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import MedicalSolutions from './pages/MedicalSolutions.jsx'
import ServiceSupport from './pages/ServiceSupport.jsx'
import Contact from './pages/Contact.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <RFQProvider>
            <Routes>
              {/* Public routes wrapped in App for header/footer */}
              <Route path="/" element={<App />}>
                <Route index element={<Navigate to="/home" replace />} />
                <Route path="home" element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="solutions" element={<MedicalSolutions />} />
                <Route path="service" element={<ServiceSupport />} />
                <Route path="contact" element={<Contact />} />
                
                {/* Admin auth pages - public */}
                <Route path="admin/login" element={<AdminLogin />} />

                {/* Admin dashboard - protected by authentication */}
                <Route element={<ProtectedRoute />}>
                  <Route path="admin" element={<AdminDashboard />} />
                </Route>
              </Route>
            </Routes>
          </RFQProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
)
