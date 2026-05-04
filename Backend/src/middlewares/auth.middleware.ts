import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface AuthRequest extends Request {
  user?: { userId: string; role: string }
}

export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    res.status(401).json({ error: 'Token no proporcionado' })
    return
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { userId: string; role: string }
    req.user = { userId: payload.userId, role: payload.role }
    next()
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' })
  }
}

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'ADMIN') {
    res.status(403).json({ error: 'Acceso de administrador requerido' })
    return
  }
  next()
}