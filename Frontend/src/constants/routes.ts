export const ROUTES = {
  HOME:            '/',
  LOGIN:           '/login',
  REGISTER:        '/register',
  VERIFY:          '/verify/:token',
  RESERVE:         '/reserve/:tableId',
  CHECKIN:         '/checkin',
  MY_RESERVATIONS: '/mis-reservas',
  ADMIN:           '/admin',
  ADMIN_CONFLICTS: '/admin/conflictos',
  ADMIN_METRICS:   '/admin/metricas',
} as const