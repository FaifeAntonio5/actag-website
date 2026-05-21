import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface RequestComAdmin extends Request {
  adminId?: number
}

export const verificarToken = (
  req: RequestComAdmin,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ erro: 'Token não fornecido.' })
    return
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { adminId: number }
    req.adminId = payload.adminId
    next()
  } catch {
    res.status(401).json({ erro: 'Token inválido ou expirado.' })
  }
}

// Adicione esta função no final do ficheiro
export const apenasAdmin = (
  req: RequestComAdmin,
  res: Response,
  next: NextFunction
): void => {
  if ((req as any).papel !== 'admin') {
    res.status(403).json({ erro: 'Acesso negado. Apenas administradores.' })
    return
  }
  next()
}