import { Request, Response } from 'express'
import prisma from '../lib/prisma'

export const listarDoadores = async (_req: Request, res: Response): Promise<void> => {
  try {
    const doadores = await prisma.doador.findMany({ orderBy: { criadoEm: 'desc' } })
    res.json(doadores)
  } catch {
    res.status(500).json({ erro: 'Erro ao buscar doadores.' })
  }
}

export const criarDoador = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nome, email, tipo} = req.body

    if (!nome || !email || !tipo) {
      res.status(400).json({ erro: 'Todos os campos são obrigatórios.' })
      return
    }

    const doador = await prisma.doador.create({
      data: { nome, email, tipo},
    })
    res.status(201).json(doador)
  } catch (e: any) {
    if (e.code === 'P2002') {
      res.status(409).json({ erro: 'Este email já está registado.' })
      return
    }
    res.status(500).json({ erro: 'Erro ao criar doador.' })
  }
}

export const eliminarDoador = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.doador.delete({ where: { id: Number(req.params.id) } })
    res.json({ mensagem: 'Doador eliminado com sucesso.' })
  } catch (e: any) {
    if (e.code === 'P2025') {
      res.status(404).json({ erro: 'Doador não encontrado.' })
      return
    }
    res.status(500).json({ erro: 'Erro ao eliminar doador.' })
  }
}