import { Router } from 'express'
import {
  listarMembros,
  obterMembro,
  criarMembro,
  actualizarMembro,
  eliminarMembro,
} from '../controllers/membros.controller'
import { verificarToken } from '../middleware/auth'

const router = Router()

// Todas as rotas de membros exigem login
//router.use(verificarToken)

router.get('/',     listarMembros)
router.get('/:id',  obterMembro)
router.post('/',    criarMembro)
router.put('/:id',  actualizarMembro)
router.delete('/:id', eliminarMembro)

export default router