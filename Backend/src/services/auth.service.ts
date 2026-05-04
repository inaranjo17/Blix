import bcrypt from 'bcrypt'
import { prisma } from '../configs/db'
import { generateJWT, generateVerifyToken } from '../utils/generateToken'

export async function registerUser(data: {
  name: string
  email: string
  phone: string
  password: string
}) {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  })
  if (existing) throw new Error('Email ya registrado')

  const passwordHash = await bcrypt.hash(data.password, 12)
  const verifyToken = generateVerifyToken()

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      passwordHash,
      verifyToken,
    },
  })

  return { user, verifyToken }
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error('Credenciales inválidas')
  if (!user.verified) throw new Error('Verifica tu email antes de ingresar')

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) throw new Error('Credenciales inválidas')

  const token = generateJWT(user.id, user.role)
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  }
}

export async function verifyEmail(token: string) {
  const user = await prisma.user.findUnique({
    where: { verifyToken: token },
  })
  if (!user) throw new Error('Token de verificación inválido')

  await prisma.user.update({
    where: { id: user.id },
    data: { verified: true, verifyToken: null },
  })

  return user
}