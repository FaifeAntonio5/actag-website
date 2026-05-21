// src/controllers/galeria.controller.ts
import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// POST /api/galeria — criar (protegido)
export const criarFoto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { src, legenda, categoria } = req.body;

    if (!src || !categoria) {
      res.status(400).json({ erro: 'URL da imagem e categoria são obrigatórios.' });
      return;
    }

    const foto = await prisma.galeria.create({
      data: { src, legenda: legenda ?? '', categoria },
    });

    res.status(201).json(foto);
  } catch (error) {
    console.error('Erro ao criar foto:', error);
    res.status(500).json({ erro: 'Erro interno ao adicionar foto.' });
  }
};

// GET /api/galeria — listar todas (público)
export const listarGaleria = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoria } = req.query;

    const fotos = await prisma.galeria.findMany({
      orderBy: { criadoEm: 'desc' },
      where: categoria ? { categoria: String(categoria) } : undefined,
    });

    res.json(fotos);
  } catch {
    res.status(500).json({ erro: 'Erro ao buscar galeria.' });
  }
};

// DELETE /api/galeria/:id — eliminar (protegido)
export const eliminarFoto = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.galeria.delete({ where: { id: Number(req.params.id) } });
    res.json({ mensagem: 'Foto eliminada com sucesso.' });
  } catch (e: any) {
    if (e.code === 'P2025') {
      res.status(404).json({ erro: 'Foto não encontrada.' });
      return;
    }
    res.status(500).json({ erro: 'Erro ao eliminar foto.' });
  }
};