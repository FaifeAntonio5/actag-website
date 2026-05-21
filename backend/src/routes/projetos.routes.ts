// src/routes/projectos.routes.ts
import { Router } from 'express';
import {
  criarProjecto,
  listarProjectos,
  obterProjecto,
  actualizarProjecto,
  eliminarProjecto,
  estatisticasProjectos,
  adicionarMembro,
  removerMembro,
  adicionarFinanciador,
  removerFinanciador,
  adicionarParceiro,
  removerParceiro,
} from '../controllers/projetos.controller';
import { verificarToken } from '../middleware/auth';

const router = Router();

// ── Rotas públicas (o site pode ler) ──────────────────────
router.get('/',    listarProjectos);
router.get('/:id', obterProjecto);

// ── Estatísticas (protegido — só dashboard) ───────────────
router.get('/estatisticas', verificarToken, estatisticasProjectos);

// ── Gestão do projecto (protegido) ────────────────────────
router.post('/',      verificarToken, criarProjecto);
router.put('/:id',    verificarToken, actualizarProjecto);
router.delete('/:id', verificarToken, eliminarProjecto);

// ── Membros responsáveis ──────────────────────────────────
router.post(  '/:id/membros/:membroId', verificarToken, adicionarMembro);
router.delete('/:id/membros/:membroId', verificarToken, removerMembro);

// ── Financiadores ─────────────────────────────────────────
router.post(  '/:id/financiadores',               verificarToken, adicionarFinanciador);
router.delete('/:id/financiadores/:financiadorId', verificarToken, removerFinanciador);

// ── Parceiros ─────────────────────────────────────────────
router.post(  '/:id/parceiros',           verificarToken, adicionarParceiro);
router.delete('/:id/parceiros/:parceiroId', verificarToken, removerParceiro);

export default router;