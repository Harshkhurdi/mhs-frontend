import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { RFQProvider } from './components/RFQContext'
import { AuthProvider } from './context/AuthContext'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import ServiceSupport from './pages/ServiceSupport.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import NotFound from './pages/NotFound.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

const MedicalSolutions = lazy(() => import('./pages/MedicalSolutions.jsx'))
const Events = lazy(() => import('./pages/Events.jsx'))
const Community = lazy(() => import('./pages/Community.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const AdminLogin = lazy(() => import('./pages/AdminLogin.jsx'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <RFQProvider>
            <Suspense
              fallback={
                <div className="empty-state" role="status">
                  Loading Medelec…
                </div>
              }
            >
              <Routes>
                {/* Public routes wrapped in App for header/footer */}
                <Route path="/" element={<App />}>
                  <Route index element={<Home />} />
                  <Route path="home" element={<Navigate to="/" replace />} />
                  <Route path="about" element={<About />} />
                  <Route path="solutions" element={<MedicalSolutions />} />
                  <Route path="service" element={<ServiceSupport />} />
                  <Route path="events" element={<Events />} />
                  <Route path="community" element={<Community />} />
                  <Route path="contact" element={<Contact />} />

                  {/* Admin auth pages - public */}
                  <Route path="admin/login" element={<AdminLogin />} />

                  {/* Admin dashboard - protected by authentication */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="admin" element={<AdminDashboard />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
          </RFQProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
