// src/controllers/projectos.controller.ts
import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// ─────────────────────────────────────────────────────────────
//  PROJECTOS — CRUD completo
// ─────────────────────────────────────────────────────────────

// POST /api/projectos
export const criarProjecto = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      nome,
      descricao,
      categoria,
      estado,
      progresso,
      meta,
      localizacao,
      orcamento,
      dataFim,
      membrosResponsaveis, // [{ membroId, funcao }]
      financiadores,       // [{ nomeEntidade, montante, tipoApoio, contacto }]
      parceiros,           // [{ nomeEntidade, tipoParticipacao, contacto }]
    } = req.body;

    if (!nome || !descricao || !categoria || !meta || !localizacao) {
      res.status(400).json({
        erro: 'Nome, descrição, categoria, meta e localização são obrigatórios.',
      });
      return;
    }

    const progressoNumerico = Number(progresso ?? 0);
    if (isNaN(progressoNumerico) || progressoNumerico < 0 || progressoNumerico > 100) {
      res.status(400).json({ erro: 'Progresso deve ser um número entre 0 e 100.' });
      return;
    }

    const projecto = await prisma.projecto.create({
      data: {
        nome,
        descricao,
        categoria,
        estado:      estado    ?? 'Activo',
        progresso:   progressoNumerico,
        meta,
        localizacao,
        orcamento:   orcamento   ? Number(orcamento) : null,
        dataFim:     dataFim     ? new Date(dataFim)  : null,

        membrosResponsaveis: membrosResponsaveis?.length
          ? {
              create: membrosResponsaveis.map((m: { membroId: number; funcao: string }) => ({
                membroId: Number(m.membroId),
                funcao:   m.funcao,
              })),
            }
          : undefined,

        financiadores: financiadores?.length
          ? {
              create: financiadores.map((f: {
                nomeEntidade: string;
                montante?:    number;
                tipoApoio:   string;
                contacto?:   string;
              }) => ({
                nomeEntidade: f.nomeEntidade,
                montante:     f.montante ? Number(f.montante) : null,
                tipoApoio:    f.tipoApoio,
                contacto:     f.contacto ?? null,
              })),
            }
          : undefined,

        parceiros: parceiros?.length
          ? {
              create: parceiros.map((p: {
                nomeEntidade:     string;
                tipoParticipacao: string;
                contacto?:        string;
              }) => ({
                nomeEntidade:     p.nomeEntidade,
                tipoParticipacao: p.tipoParticipacao,
                contacto:         p.contacto ?? null,
              })),
            }
          : undefined,
      },
      include: {
        membrosResponsaveis: {
          include: { membro: { select: { id: true, nome: true, cargo: true } } },
        },
        financiadores: true,
        parceiros:     true,
      },
    });

    res.status(201).json(projecto);
  } catch (erro: any) {
    console.error('Erro ao criar projecto:', erro);
    if (erro.code === 'P2003') {
      res.status(400).json({ erro: 'Um dos membros indicados não existe.' });
      return;
    }
    res.status(500).json({ erro: 'Erro interno ao criar projecto.' });
  }
};

// GET /api/projectos
export const listarProjectos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { estado, categoria, pesquisa } = req.query;

    const projectos = await prisma.projecto.findMany({
      orderBy: { criadoEm: 'desc' },
      where: {
        ...(estado    ? { estado:    String(estado)    } : {}),
        ...(categoria ? { categoria: String(categoria) } : {}),
        ...(pesquisa  ? {
          OR: [
            { nome:        { contains: String(pesquisa), mode: 'insensitive' } },
            { descricao:   { contains: String(pesquisa), mode: 'insensitive' } },
            { localizacao: { contains: String(pesquisa), mode: 'insensitive' } },
          ],
        } : {}),
      },
      include: {
        membrosResponsaveis: {
          include: { membro: { select: { id: true, nome: true, cargo: true } } },
        },
        financiadores: true,
        parceiros:     true,
      },
    });

    res.json(projectos);
  } catch (erro) {
    console.error('Erro ao listar projectos:', erro);
    res.status(500).json({ erro: 'Erro ao buscar projectos.' });
  }
};

// GET /api/projectos/estatisticas
export const estatisticasProjectos = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [total, activos, concluidos, pausados, agregado] = await Promise.all([
      prisma.projecto.count(),
      prisma.projecto.count({ where: { estado: 'Activo'    } }),
      prisma.projecto.count({ where: { estado: 'Concluído' } }),
      prisma.projecto.count({ where: { estado: 'Pausado'   } }),
      prisma.projecto.aggregate({ _avg: { progresso: true } }),
    ]);

    res.json({
      total,
      activos,
      concluidos,
      pausados,
      progressoMedio: Math.round(agregado._avg.progresso ?? 0),
    });
  } catch (erro) {
    console.error('Erro nas estatísticas:', erro);
    res.status(500).json({ erro: 'Erro ao calcular estatísticas.' });
  }
};

// GET /api/projectos/:id
export const obterProjecto = async (req: Request, res: Response): Promise<void> => {
  try {
    const projecto = await prisma.projecto.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        membrosResponsaveis: {
          include: {
            membro: { select: { id: true, nome: true, email: true, cargo: true } },
          },
        },
        financiadores: true,
        parceiros:     true,
      },
    });

    if (!projecto) {
      res.status(404).json({ erro: 'Projecto não encontrado.' });
      return;
    }

    res.json(projecto);
  } catch (erro) {
    console.error('Erro ao obter projecto:', erro);
    res.status(500).json({ erro: 'Erro ao buscar projecto.' });
  }
};

// PUT /api/projectos/:id
export const actualizarProjecto = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const {
      nome, descricao, categoria, estado,
      progresso, meta, localizacao, orcamento, dataFim,
    } = req.body;

    const projecto = await prisma.projecto.update({
      where: { id },
      data: {
        ...(nome        !== undefined && { nome }),
        ...(descricao   !== undefined && { descricao }),
        ...(categoria   !== undefined && { categoria }),
        ...(estado      !== undefined && { estado }),
        ...(progresso   !== undefined && { progresso: Number(progresso) }),
        ...(meta        !== undefined && { meta }),
        ...(localizacao !== undefined && { localizacao }),
        ...(orcamento   !== undefined && { orcamento: orcamento ? Number(orcamento) : null }),
        ...(dataFim     !== undefined && { dataFim: dataFim ? new Date(dataFim) : null }),
      },
      include: {
        membrosResponsaveis: {
          include: { membro: { select: { id: true, nome: true, cargo: true } } },
        },
        financiadores: true,
        parceiros:     true,
      },
    });

    res.json(projecto);
  } catch (erro: any) {
    if (erro.code === 'P2025') {
      res.status(404).json({ erro: 'Projecto não encontrado.' });
      return;
    }
    console.error('Erro ao actualizar projecto:', erro);
    res.status(500).json({ erro: 'Erro ao actualizar projecto.' });
  }
};

// DELETE /api/projectos/:id
export const eliminarProjecto = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.projecto.delete({ where: { id: Number(req.params.id) } });
    res.json({ mensagem: 'Projecto eliminado com sucesso.' });
  } catch (erro: any) {
    if (erro.code === 'P2025') {
      res.status(404).json({ erro: 'Projecto não encontrado.' });
      return;
    }
    console.error('Erro ao eliminar projecto:', erro);
    res.status(500).json({ erro: 'Erro ao eliminar projecto.' });
  }
};

// ─────────────────────────────────────────────────────────────
//  MEMBROS RESPONSÁVEIS
// ─────────────────────────────────────────────────────────────

// POST /api/projectos/:id/membros
export const adicionarMembro = async (req: Request, res: Response): Promise<void> => {
  try {
    const projectoId = Number(req.params.id);
    const { membroId, funcao } = req.body;

    if (!membroId || !funcao) {
      res.status(400).json({ erro: 'membroId e funcao são obrigatórios.' });
      return;
    }

    const relacao = await prisma.projectoMembro.create({
      data: { projectoId, membroId: Number(membroId), funcao },
      include: {
        membro: { select: { id: true, nome: true, cargo: true } },
      },
    });

    res.status(201).json(relacao);
  } catch (erro: any) {
    if (erro.code === 'P2002') {
      res.status(409).json({ erro: 'Este membro já está associado a este projecto.' });
      return;
    }
    if (erro.code === 'P2003') {
      res.status(404).json({ erro: 'Membro ou projecto não encontrado.' });
      return;
    }
    console.error('Erro ao adicionar membro:', erro);
    res.status(500).json({ erro: 'Erro ao adicionar membro ao projecto.' });
  }
};

// DELETE /api/projectos/:id/membros/:membroId
export const removerMembro = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.projectoMembro.deleteMany({
      where: {
        projectoId: Number(req.params.id),
        membroId:   Number(req.params.membroId),
      },
    });
    res.json({ mensagem: 'Membro removido do projecto.' });
  } catch (erro) {
    console.error('Erro ao remover membro:', erro);
    res.status(500).json({ erro: 'Erro ao remover membro do projecto.' });
  }
};

// ─────────────────────────────────────────────────────────────
//  FINANCIADORES
// ─────────────────────────────────────────────────────────────

// POST /api/projectos/:id/financiadores
export const adicionarFinanciador = async (req: Request, res: Response): Promise<void> => {
  try {
    const projectoId = Number(req.params.id);
    const { nomeEntidade, montante, tipoApoio, contacto } = req.body;

    if (!nomeEntidade || !tipoApoio) {
      res.status(400).json({ erro: 'nomeEntidade e tipoApoio são obrigatórios.' });
      return;
    }

    const financiador = await prisma.projectoFinanciador.create({
      data: {
        projectoId,
        nomeEntidade,
        montante:  montante ? Number(montante) : null,
        tipoApoio,
        contacto:  contacto ?? null,
      },
    });

    res.status(201).json(financiador);
  } catch (erro) {
    console.error('Erro ao adicionar financiador:', erro);
    res.status(500).json({ erro: 'Erro ao adicionar financiador.' });
  }
};

// DELETE /api/projectos/:id/financiadores/:financiadorId
export const removerFinanciador = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.projectoFinanciador.delete({
      where: { id: Number(req.params.financiadorId) },
    });
    res.json({ mensagem: 'Financiador removido.' });
  } catch (erro: any) {
    if (erro.code === 'P2025') {
      res.status(404).json({ erro: 'Financiador não encontrado.' });
      return;
    }
    res.status(500).json({ erro: 'Erro ao remover financiador.' });
  }
};

// ─────────────────────────────────────────────────────────────
//  PARCEIROS
// ─────────────────────────────────────────────────────────────

// POST /api/projectos/:id/parceiros
export const adicionarParceiro = async (req: Request, res: Response): Promise<void> => {
  try {
    const projectoId = Number(req.params.id);
    const { nomeEntidade, tipoParticipacao, contacto } = req.body;

    if (!nomeEntidade || !tipoParticipacao) {
      res.status(400).json({ erro: 'nomeEntidade e tipoParticipacao são obrigatórios.' });
      return;
    }

    const parceiro = await prisma.projectoParceiro.create({
      data: {
        projectoId,
        nomeEntidade,
        tipoParticipacao,
        contacto: contacto ?? null,
      },
    });

    res.status(201).json(parceiro);
  } catch (erro) {
    console.error('Erro ao adicionar parceiro:', erro);
    res.status(500).json({ erro: 'Erro ao adicionar parceiro.' });
  }
};

// DELETE /api/projectos/:id/parceiros/:parceiroId
export const removerParceiro = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.projectoParceiro.delete({
      where: { id: Number(req.params.parceiroId) },
    });
    res.json({ mensagem: 'Parceiro removido.' });
  } catch (erro: any) {
    if (erro.code === 'P2025') {
      res.status(404).json({ erro: 'Parceiro não encontrado.' });
      return;
    }
    res.status(500).json({ erro: 'Erro ao remover parceiro.' });
  }
};