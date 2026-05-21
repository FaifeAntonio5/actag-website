import { Request, Response } from 'express'
import prisma from '../lib/prisma'

// POST /api/contacto  — chamado pelo formulário do frontend
export const enviarContacto = async (req: Request, res: Response): Promise<void> => {
  try {
    // Destrutura o campo 'projecto' que agora vem opcionalmente do frontend
    const { nome, email, assunto, mensagem, projecto } = req.body

    if (!nome || !email || !assunto || !mensagem) {
      res.status(400).json({ erro: 'Todos os campos são obrigatórios.' })
      return
    }

    // 1. Guarda sempre a mensagem na tabela Contacto
    const contacto = await prisma.contacto.create({
      data: { nome, email, assunto, mensagem },
    })

    // 2. Se o assunto for "Voluntariado", insere também na tabela Voluntario usando o projeto digitado
    if (assunto === 'Voluntariado') {
      try {
        // Verifica primeiro se o email já existe para evitar o erro P2002 do Prisma
        const voluntarioExistente = await prisma.voluntario.findUnique({
          where: { email }
        })

        if (!voluntarioExistente) {
          await prisma.voluntario.create({
            data: {
              nome,
              email,
              // Captura o projeto vindo do formulário. Se falhar por algum motivo, usa o fallback.
              projecto: projecto && projecto.trim() ? projecto : 'Geral / A definir',
              status: 'Em Espera'
            }
          })
        }
      } catch (erroVoluntario) {
        console.error('Erro ao espelhar voluntário:', erroVoluntario)
      }
    }

    res.status(201).json({ mensagem: 'Mensagem recebida com sucesso.', id: contacto.id })
  } catch {
    res.status(500).json({ erro: 'Erro ao guardar mensagem.' })
  }
}

// GET /api/contacto  — listagem no dashboard (protegida)
export const listarContactos = async (_req: Request, res: Response): Promise<void> => {
  try {
    const contactos = await prisma.contacto.findMany({ orderBy: { criadoEm: 'desc' } })
    res.json(contactos)
  } catch {
    res.status(500).json({ erro: 'Erro ao buscar mensagens.' })
  }
}

// DELETE /api/contacto/:id
export const eliminarContacto = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.contacto.delete({ where: { id: Number(req.params.id) } })
    res.json({ mensagem: 'Mensagem eliminada.' })
  } catch (e: any) {
    if (e.code === 'P2025') {
      res.status(404).json({ erro: 'Mensagem não encontrada.' })
      return
    }
    res.status(500).json({ erro: 'Erro ao eliminar mensagem.' })
  }
}