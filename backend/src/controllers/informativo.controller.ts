import { Request, Response } from 'express'
import prisma from '../lib/prisma'
import { transporter } from '../lib/mailer' // Certifique-se de que este arquivo existe

// POST /api/newsletter — subscrever
export const subscrever = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nome, email } = req.body

    // Validação básica
    if (!nome || nome.trim().length < 2) {
      res.status(400).json({ erro: 'Por favor, insira um nome válido.' })
      return
    }

    if (!email || !email.includes('@')) {
      res.status(400).json({ erro: 'Por favor, insira um email válido.' })
      return
    }

    const emailFormatado = email.toLowerCase().trim()

    // Verifica se já existe
    const existe = await prisma.informativo.findUnique({ 
      where: { email: emailFormatado } 
    })

    if (existe) {
      if (existe.activo) {
        res.status(409).json({ erro: 'Este email já está subscrito.' })
        return
      }
      
      // Reactivar e atualizar o nome
      await prisma.informativo.update({
        where: { email: emailFormatado },
        data: { 
          nome: nome.trim(),
          activo: true 
        },
      })
      res.json({ mensagem: 'Subscrição reactivada com sucesso!' })
      return
    }

    // 1. Cria novo registro no Banco de Dados
    await prisma.informativo.create({ 
      data: { 
        nome: nome.trim(), 
        email: emailFormatado 
      } 
    })

    // 2. Envia o E-mail de Boas-vindas (SMTP)
    try {
      await transporter.sendMail({
        from: '"ACTAG-MZ" <geral@actag.org.mz>',
        to: emailFormatado,
        subject: "Bem-vindo ao nosso Boletim Informativo! 🌿",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px;">
            <h2 style="color: #2e7d32;">Olá, ${nome.trim()}!</h2>
            <p>É com muita alegria que confirmamos a tua subscrição no boletim informativo da <strong>ACTAG-MZ</strong>.</p>
            <p>A partir de agora, estarás a par de todas as nossas actividades, desde a protecção dos mangais até às campanhas de reflorestamento em Moçambique.</p>
            <p style="background: #f1f8e9; padding: 15px; border-left: 4px solid #2e7d32;">
              <strong>Juntos, estamos a proteger a nossa biodiversidade costeira!</strong>
            </p>
            <p>Fica atento às próximas novidades.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <small style="color: #888;">Este é um e-mail automático. Por favor, não respondas a este endereço.</small>
          </div>
        `,
      })
    } catch (mailError) {
      // Apenas fazemos log se o e-mail falhar, para não travar a resposta do utilizador
      console.error("Erro ao enviar e-mail de boas-vindas:", mailError)
    }

    res.status(201).json({ mensagem: 'Subscrição realizada com sucesso!' })

  } catch (error) {
    console.error("Erro no POST newsletter:", error)
    res.status(500).json({ erro: 'Erro ao processar subscrição.' })
  }
}

// GET /api/newsletter — listar (protegido)
export const listarSubscritos = async (_req: Request, res: Response): Promise<void> => {
  try {
    const lista = await prisma.informativo.findMany({
      where: { activo: true },
      orderBy: { criadoEm: 'desc' },
    })
    res.json(lista)
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar subscritores.' })
  }
}

// DELETE /api/newsletter/:email — cancelar subscrição
export const cancelarSubscricao = async (req: Request, res: Response): Promise<void> => {
  try {
    const email = req.params.email as string;

    const registro = await prisma.informativo.findUnique({ 
      where: { email } 
    })

    if (!registro) {
      res.status(404).json({ erro: 'Email não encontrado.' })
      return
    }

    await prisma.informativo.update({
      where: { email },
      data: { activo: false },
    })

    res.json({ mensagem: 'Subscrição cancelada.' })
  } catch (error) {
    console.error("Erro no DELETE newsletter:", error)
    res.status(500).json({ erro: 'Erro ao processar cancelamento.' })
  }
}