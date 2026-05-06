import { Request, Response } from 'express'
import * as authService from '../services/auth.service'
import { sendVerificationEmail } from '../services/email.service'
import { prisma } from '../configs/db'

export async function register(req: Request, res: Response) {
  try {
    const { user, verifyToken } = await authService.registerUser(req.body)
    await sendVerificationEmail(user.email, user.name, verifyToken)
    res.status(201).json({
      message: '¡Registrado! Revisa tu correo para verificar tu cuenta.',
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al registrar'
    res.status(400).json({ error: message })
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body
    const result = await authService.loginUser(email, password)
    res.json(result)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al iniciar sesión'
    res.status(401).json({ error: message })
  }
}

export async function verify(req: Request, res: Response) {
  try {
    const token = req.params.token as string
    await authService.verifyEmail(token)
    res.json({ message: '¡Email verificado! Ya puedes iniciar sesión.' })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error de verificación'

    // TOKEN_ALREADY_USED significa que el link ya fue usado exitosamente antes
    // Devolver 200 en lugar de 400 — desde la perspectiva del usuario, su cuenta SÍ está verificada
    if (message === 'TOKEN_ALREADY_USED') {
      res.json({ message: '¡Email verificado! Ya puedes iniciar sesión.' })
      return
    }

    res.status(400).json({ error: message })
  }
}

export async function me(req: Request, res: Response) {
  try {
    const authReq = req as Request & { user: { userId: string; role: string } }  // ← fix línea 43
    const user = await prisma.user.findUnique({
      where: { id: authReq.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
      },
    })
    res.json(user)
  } catch (err: unknown) {
    res.status(500).json({ error: 'Error al obtener usuario' })
  }
}