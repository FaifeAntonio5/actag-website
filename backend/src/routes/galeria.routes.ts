// src/routes/galeria.routes.ts
import { Router } from 'express';
import {
  criarFoto,
  listarGaleria,
  eliminarFoto,
} from '../controllers/galeria.controller';
import { verificarToken } from '../middleware/auth';

const router = Router();

// Pública
router.get('/', listarGaleria);

// Protegidas
router.post('/',      verificarToken, criarFoto);
router.delete('/:id', verificarToken, eliminarFoto);

export default router;