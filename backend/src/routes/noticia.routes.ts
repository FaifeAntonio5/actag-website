// src/routes/noticias.routes.ts
import { Router } from 'express';
import {
  criarNoticia,
  listarNoticias,
  obterNoticia,
  actualizarNoticia,
  eliminarNoticia,
} from '../controllers/noticias.controller';
import { verificarToken } from '../middleware/auth';

const router = Router();

// Públicas
router.get('/',    listarNoticias);
router.get('/:id', obterNoticia);

// Protegidas
router.post('/',      verificarToken, criarNoticia);
router.put('/:id',    verificarToken, actualizarNoticia);
router.delete('/:id', verificarToken, eliminarNoticia);

export default router;