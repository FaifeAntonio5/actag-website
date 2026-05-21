import { Router } from 'express'
import { listarDoadores, criarDoador, eliminarDoador } from '../controllers/doadores.controller'
import { verificarToken } from '../middleware/auth'

const router = Router()

router.use(verificarToken)

router.get('/',       listarDoadores)
router.post('/',      criarDoador)
router.delete('/:id', eliminarDoador)

export default router