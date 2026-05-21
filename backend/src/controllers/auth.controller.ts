import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma'

export const registar = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nome, email, senha, papel } = req.body

    if (!nome || !email || !senha) {
      res.status(400).json({ erro: 'Todos os campos são obrigatórios.' })
      return
    }

    const papelValido = ['admin', 'editor'].includes(papel) ? papel : 'editor'

    const existe = await prisma.admin.findUnique({ where: { email } })
    if (existe) {
      res.status(409).json({ erro: 'Este email já está registado.' })
      return
    }

    const senhaHash = await bcrypt.hash(senha, 10)
    const admin = await prisma.admin.create({
      data: { nome, email, senha: senhaHash, papel: papelValido },
    })

    res.status(201).json({
      mensagem: 'Utilizador criado com sucesso.',
      id: admin.id,
      papel: admin.papel,
    })
  } catch {
    res.status(500).json({ erro: 'Erro interno do servidor.' })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, senha } = req.body

    if (!email || !senha) {
      res.status(400).json({ erro: 'Email e senha são obrigatórios.' })
      return
    }

    const admin = await prisma.admin.findUnique({ where: { email } })
    if (!admin) {
      res.status(401).json({ erro: 'Credenciais inválidas.' })
      return
    }

    const senhaCorrecta = await bcrypt.compare(senha, admin.senha)
    if (!senhaCorrecta) {
      res.status(401).json({ erro: 'Credenciais inválidas.' })
      return
    }

    const token = jwt.sign(
      { adminId: admin.id, papel: admin.papel },
      process.env.JWT_SECRET as string,
      { expiresIn: '8h' }
    )

    res.json({
      mensagem: 'Login efectuado com sucesso.',
      token,
      utilizador: {
        id:    admin.id,
        nome:  admin.nome,
        email: admin.email,
        papel: admin.papel,   // ← "admin" ou "editor"
      },
    })
  } catch {
    res.status(500).json({ erro: 'Erro interno do servidor.' })
  }
}

export const perfil = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = (req as any).adminId
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: { id: true, nome: true, email: true, papel: true, criadoEm: true },
    })
    res.json(admin)
  } catch {
    res.status(500).json({ erro: 'Erro interno do servidor.' })
  }
}