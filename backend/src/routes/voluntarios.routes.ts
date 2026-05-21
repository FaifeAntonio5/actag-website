import { Router } from 'express'
import {
  listarVoluntarios,
  obterVoluntario,
  criarVoluntario,
  actualizarVoluntario,
  eliminarVoluntario,
} from '../controllers/voluntarios.controller'
import { verificarToken } from '../middleware/auth'

const router = Router()

//router.use(verificarToken)

router.get('/',       listarVoluntarios)
router.get('/:id',    obterVoluntario)
router.post('/',      criarVoluntario)
router.put('/:id',    actualizarVoluntario)
router.delete('/:id', eliminarVoluntario)

export default router