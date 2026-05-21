import { Request, Response } from 'express'
import prisma from '../lib/prisma'

export const listarVoluntarios = async (_req: Request, res: Response): Promise<void> => {
  try {
    const voluntarios = await prisma.voluntario.findMany({ orderBy: { criadoEm: 'desc' } })
    res.json(voluntarios)
  } catch {
    res.status(500).json({ erro: 'Erro ao buscar voluntários.' })
  }
}

export const obterVoluntario = async (req: Request, res: Response): Promise<void> => {
  try {
    const voluntario = await prisma.voluntario.findUnique({
      where: { id: Number(req.params.id) },
    })
    if (!voluntario) {
      res.status(404).json({ erro: 'Voluntário não encontrado.' })
      return
    }
    res.json(voluntario)
  } catch {
    res.status(500).json({ erro: 'Erro ao buscar voluntário.' })
  }
}

export const criarVoluntario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nome, email, projecto } = req.body

    if (!nome || !email || !projecto) {
      res.status(400).json({ erro: 'Nome, email e projecto são obrigatórios.' })
      return
    }

    const voluntario = await prisma.voluntario.create({
      data: { nome, email, projecto },
    })
    res.status(201).json(voluntario)
  } catch (e: any) {
    if (e.code === 'P2002') {
      res.status(409).json({ erro: 'Este email já está registado.' })
      return
    }
    res.status(500).json({ erro: 'Erro ao criar voluntário.' })
  }
}

export const actualizarVoluntario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nome, email, projecto, status } = req.body
    const voluntario = await prisma.voluntario.update({
      where: { id: Number(req.params.id) },
      data: { nome, email, projecto, status },
    })
    res.json(voluntario)
  } catch (e: any) {
    if (e.code === 'P2025') {
      res.status(404).json({ erro: 'Voluntário não encontrado.' })
      return
    }
    res.status(500).json({ erro: 'Erro ao actualizar voluntário.' })
  }
}

export const eliminarVoluntario = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.voluntario.delete({ where: { id: Number(req.params.id) } })
    res.json({ mensagem: 'Voluntário eliminado com sucesso.' })
  } catch (e: any) {
    if (e.code === 'P2025') {
      res.status(404).json({ erro: 'Voluntário não encontrado.' })
      return
    }
    res.status(500).json({ erro: 'Erro ao eliminar voluntário.' })
  }
}