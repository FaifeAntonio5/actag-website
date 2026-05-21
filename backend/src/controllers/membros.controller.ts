import { Request, Response } from 'express'
import prisma from '../lib/prisma'

// GET /api/membros
export const listarMembros = async (_req: Request, res: Response): Promise<void> => {
  try {
    const membros = await prisma.membro.findMany({ orderBy: { criadoEm: 'desc' } })
    res.json(membros)
  } catch {
    res.status(500).json({ erro: 'Erro ao buscar membros.' })
  }
}

// GET /api/membros/:id
export const obterMembro = async (req: Request, res: Response): Promise<void> => {
  try {
    const membro = await prisma.membro.findUnique({
      where: { id: Number(req.params.id) },
    })
    if (!membro) {
      res.status(404).json({ erro: 'Membro não encontrado.' })
      return
    }
    res.json(membro)
  } catch {
    res.status(500).json({ erro: 'Erro ao buscar membro.' })
  }
}

// POST /api/membros
export const criarMembro = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nome, email, cargo } = req.body

    if (!nome || !email || !cargo) {
      res.status(400).json({ erro: 'Nome, email e cargo são obrigatórios.' })
      return
    }

    const membro = await prisma.membro.create({
      data: { nome, email, cargo },
    })
    res.status(201).json(membro)
  } catch (e: any) {
    if (e.code === 'P2002') {
      res.status(409).json({ erro: 'Este email já está registado.' })
      return
    }
    res.status(500).json({ erro: 'Erro ao criar membro.' })
  }
}

// PUT /api/membros/:id
export const actualizarMembro = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nome, email, cargo, status } = req.body
    const membro = await prisma.membro.update({
      where: { id: Number(req.params.id) },
      data: { nome, email, cargo, status },
    })
    res.json(membro)
  } catch (e: any) {
    if (e.code === 'P2025') {
      res.status(404).json({ erro: 'Membro não encontrado.' })
      return
    }
    res.status(500).json({ erro: 'Erro ao actualizar membro.' })
  }
}

// DELETE /api/membros/:id
export const eliminarMembro = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.membro.delete({ where: { id: Number(req.params.id) } })
    res.json({ mensagem: 'Membro eliminado com sucesso.' })
  } catch (e: any) {
    if (e.code === 'P2025') {
      res.status(404).json({ erro: 'Membro não encontrado.' })
      return
    }
    res.status(500).json({ erro: 'Erro ao eliminar membro.' })
  }
}