// src/controllers/blog.controller.ts
import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// POST /api/blog — criar (protegido)
export const criarArtigo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { titulo, resumo, conteudo, categoria, tempoLeitura, imagem } = req.body;

    if (!titulo || !conteudo || !categoria) {
      res.status(400).json({ erro: 'Título, conteúdo e categoria são obrigatórios.' });
      return;
    }

    const artigo = await prisma.artigoBlog.create({
      data: {
        titulo,
        resumo:       resumo       ?? '',
        conteudo,
        categoria,
        tempoLeitura: tempoLeitura ?? '3 min',
        imagem:       imagem       ?? null,
      },
    });

    res.status(201).json(artigo);
  } catch (error) {
    console.error('Erro ao criar artigo:', error);
    res.status(500).json({ erro: 'Erro interno ao criar artigo.' });
  }
};

// GET /api/blog — listar todos (público)
export const listarArtigos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoria } = req.query;

    const artigos = await prisma.artigoBlog.findMany({
      orderBy: { criadoEm: 'desc' },
      where: categoria ? { categoria: String(categoria) } : undefined,
    });

    res.json(artigos);
  } catch {
    res.status(500).json({ erro: 'Erro ao buscar artigos.' });
  }
};

// GET /api/blog/:id — obter um (público)
export const obterArtigo = async (req: Request, res: Response): Promise<void> => {
  try {
    const artigo = await prisma.artigoBlog.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!artigo) {
      res.status(404).json({ erro: 'Artigo não encontrado.' });
      return;
    }

    res.json(artigo);
  } catch {
    res.status(500).json({ erro: 'Erro ao buscar artigo.' });
  }
};

// DELETE /api/blog/:id — eliminar (protegido)
export const eliminarArtigo = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.artigoBlog.delete({ where: { id: Number(req.params.id) } });
    res.json({ mensagem: 'Artigo eliminado com sucesso.' });
  } catch (e: any) {
    if (e.code === 'P2025') {
      res.status(404).json({ erro: 'Artigo não encontrado.' });
      return;
    }
    res.status(500).json({ erro: 'Erro ao eliminar artigo.' });
  }
};