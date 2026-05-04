import jwt from 'jsonwebtoken'
import crypto from 'crypto'

export function generateJWT(userId: string, role: string): string {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  )
}

export function generateVerifyToken(): string {
  return crypto.randomBytes(32).toString('hex')
}