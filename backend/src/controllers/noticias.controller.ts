// src/controllers/noticias.controller.ts
import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// POST /api/noticias — criar (protegido)
export const criarNoticia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { titulo, resumo, conteudo, categoria, imagem } = req.body;

    if (!titulo || !conteudo || !categoria) {
      res.status(400).json({ erro: 'Título, conteúdo e categoria são obrigatórios.' });
      return;
    }

    const noticia = await prisma.noticia.create({
      data: {
        titulo,
        resumo:        resumo    ?? '',
        conteudo,
        categoria,
        imagem:        imagem    ?? null,
        dataFormatada: new Date().toLocaleDateString('pt-MZ', {
          day: '2-digit', month: 'long', year: 'numeric',
        }),
      },
    });

    res.status(201).json(noticia);
  } catch (error) {
    console.error('Erro ao criar notícia:', error);
    res.status(500).json({ erro: 'Erro interno ao criar notícia.' });
  }
};

// GET /api/noticias — listar todas (público)
export const listarNoticias = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoria } = req.query;

    const noticias = await prisma.noticia.findMany({
      orderBy: { data: 'desc' },
      where: categoria ? { categoria: String(categoria) } : undefined,
    });

    res.json(noticias);
  } catch {
    res.status(500).json({ erro: 'Erro ao buscar notícias.' });
  }
};

// GET /api/noticias/:id — obter uma (público)
export const obterNoticia = async (req: Request, res: Response): Promise<void> => {
  try {
    const noticia = await prisma.noticia.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!noticia) {
      res.status(404).json({ erro: 'Notícia não encontrada.' });
      return;
    }

    res.json(noticia);
  } catch {
    res.status(500).json({ erro: 'Erro ao buscar notícia.' });
  }
};

// PUT /api/noticias/:id — actualizar (protegido)
export const actualizarNoticia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { titulo, resumo, conteudo, categoria, imagem } = req.body;

    const noticia = await prisma.noticia.update({
      where: { id: Number(req.params.id) },
      data:  { titulo, resumo, conteudo, categoria, imagem },
    });

    res.json(noticia);
  } catch (e: any) {
    if (e.code === 'P2025') {
      res.status(404).json({ erro: 'Notícia não encontrada.' });
      return;
    }
    res.status(500).json({ erro: 'Erro ao actualizar notícia.' });
  }
};

// DELETE /api/noticias/:id — eliminar (protegido)
export const eliminarNoticia = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.noticia.delete({ where: { id: Number(req.params.id) } });
    res.json({ mensagem: 'Notícia eliminada com sucesso.' });
  } catch (e: any) {
    if (e.code === 'P2025') {
      res.status(404).json({ erro: 'Notícia não encontrada.' });
      return;
    }
    res.status(500).json({ erro: 'Erro ao eliminar notícia.' });
  }
};

export const buscarNoticiaPorId = async (req: Request, res: Response) => {
  const { id } = req.params;
  const noticia = await prisma.noticia.findUnique({
    where: { id: Number(id) }
  });
  res.json(noticia);
};