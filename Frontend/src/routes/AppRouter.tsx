import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute }    from './ProtectedRoute'
import { LandingPage }       from '../pages/Landing'
import { HomePage }          from '../pages/Home'
import { LoginPage }         from '../pages/Login'
import { RegisterPage }      from '../pages/Register'
import { VerifyPage }        from '../pages/Verify'
import { CheckInPage }       from '../pages/CheckIn'
import { MyReservationsPage} from '../pages/MyReservations'
import { ReservePage }       from '../pages/Reserve'
import { AdminDashboard }    from '../pages/admin/Dashboard'
import { QRGeneratorPage }   from '../pages/admin/QRGenerator'

export function AppRouter() {
  return (
    <Routes>
      {/* Landing — selección de centro comercial */}
      <Route path="/"       element={<LandingPage />} />
      {/* Mapa de la plazoleta */}
      <Route path="/mapa"   element={<HomePage />} />
      {/* Auth */}
      <Route path="/login"         element={<LoginPage />} />
      <Route path="/register"      element={<RegisterPage />} />
      <Route path="/verify/:token" element={<VerifyPage />} />

      {/* Protegidas */}
      <Route path="/checkin"
        element={<ProtectedRoute><CheckInPage /></ProtectedRoute>} />
      <Route path="/mis-reservas"
        element={<ProtectedRoute><MyReservationsPage /></ProtectedRoute>} />
      <Route path="/reserve/:tableId"
        element={<ProtectedRoute><ReservePage /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin"
        element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/qr"
        element={<ProtectedRoute requireAdmin><QRGeneratorPage /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}