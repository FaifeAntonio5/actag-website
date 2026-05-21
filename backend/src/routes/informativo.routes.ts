import { Router } from 'express'
import { subscrever, listarSubscritos, cancelarSubscricao } from '../controllers/informativo.controller'
import { verificarToken } from '../middleware/auth'

const router = Router()

// Público — qualquer visitante pode subscrever
router.post('/', subscrever)

// Protegido — só admin
//router.get('/',              verificarToken, listarSubscritos)
//router.delete('/:email',     verificarToken, cancelarSubscricao)
router.get('/', listarSubscritos)
router.delete('/:email',  cancelarSubscricao)

export default router