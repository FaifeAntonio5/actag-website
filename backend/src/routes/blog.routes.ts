// src/routes/blog.routes.ts
import { Router } from 'express';
import {
  criarArtigo,
  listarArtigos,
  obterArtigo,
  eliminarArtigo,
} from '../controllers/blog.controller';
import { verificarToken } from '../middleware/auth';

const router = Router();

// Públicas
router.get('/',    listarArtigos);
router.get('/:id', obterArtigo);

// Protegidas
router.post('/',      verificarToken, criarArtigo);
router.delete('/:id', verificarToken, eliminarArtigo);

export default router;