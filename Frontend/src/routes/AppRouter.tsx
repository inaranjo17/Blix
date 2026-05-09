import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { QRGeneratorPage } from '../pages/admin/QRGenerator'

// Pages
import { HomePage }           from '../pages/Home'
import { LoginPage }          from '../pages/Login'
import { RegisterPage }       from '../pages/Register'
import { VerifyPage }         from '../pages/Verify'
import { CheckInPage }        from '../pages/CheckIn'
import { MyReservationsPage } from '../pages/MyReservations'
import { ReservePage }        from '../pages/Reserve'
import { AdminDashboard }     from '../pages/admin/Dashboard'

export function AppRouter() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/"               element={<HomePage />} />
      <Route path="/login"          element={<LoginPage />} />
      <Route path="/register"       element={<RegisterPage />} />
      <Route path="/verify/:token"  element={<VerifyPage />} />

      {/* Protegidas — requieren sesión */}
      <Route
        path="/checkin"
        element={
          <ProtectedRoute>
            <CheckInPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mis-reservas"
        element={
          <ProtectedRoute>
            <MyReservationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reserve/:tableId"
        element={
          <ProtectedRoute>
            <ReservePage />
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
      path="/admin/qr"
      element={
      <ProtectedRoute requireAdmin>
        <QRGeneratorPage />
        </ProtectedRoute>
      }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}