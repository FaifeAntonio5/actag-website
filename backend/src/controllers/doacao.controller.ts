import { Request, Response } from 'express'
import prisma from '../lib/prisma'

// POST /api/doacoes  — chamado pela página de doação do frontend
export const registarDoacao = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nome, email, montante, frequencia, metodo } = req.body

    // 1. Verificar campos e buscar/criar o Doador
    // Usamos upsert: se o email existir, ele pega o doador; se não, ele cria um novo.
// O fechamento deve ter o }); após o bloco create

    // 1. Validação básica de segurança
    if (!nome || !email || !montante) {
      res.status(400).json({ erro: 'Nome, email e montante são obrigatórios.' })
      return
    }
    
    const doador = await prisma.doador.upsert({
      where: { email },
      update: {nome}, // Atualiza o nome caso o doador tenha mudado
      create: {
        nome,
        email,
        tipo: "Individual",
      },
    }); // <--- VERIFIQUE SE ESTE FECHAMENTO ESTÁ AQUI

    const doacao = await prisma.doacao.create({
      data: {
        montante: Number(montante),
        frequencia,
        metodo,
        doadorId: doador.id,
      },
    });

    res.status(201).json({ mensagem: 'Doação registada com sucesso.', id: doacao.id })
  } catch (error) {
    console.error(error) // Importante para você ver o erro real no console
    res.status(500).json({ erro: 'Erro ao registar doação.' })
  }
}

// GET /api/doacoes — listagem no dashboard (protegida)
export const listarDoacoes = async (_req: Request, res: Response): Promise<void> => {
  try {
    const doacoes = await prisma.doacao.findMany({
      include: {
        doador: true, // Isso traz nome, email, etc. do Doador vinculado
      },
      orderBy: { criadoEm: 'desc' },
    });

    // Formatamos para que o Frontend receba o nome no nível principal do objeto
    const resultado = doacoes.map((d) => ({
      id: d.id,
      montante: d.montante,
      frequencia: d.frequencia,
      metodo: d.metodo,
      criadoEm: d.criadoEm,
      nome: d.doador.nome,   // Nome que o Dashboard precisa
      email: d.doador.email, // Email que o Dashboard precisa
    }));

    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar doações.' });
  }
};

// GET /api/doacoes/total  — soma total das doações
export const totalDoacoes = async (_req: Request, res: Response): Promise<void> => {
  try {
    const resultado = await prisma.doacao.aggregate({ _sum: { montante: true } })
    res.json({ total: resultado._sum.montante ?? 0 })
  } catch {
    res.status(500).json({ erro: 'Erro ao calcular total.' })
  }
}