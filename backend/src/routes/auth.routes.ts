import { Router } from 'express'
import { registar, login, perfil } from '../controllers/auth.controller'
import { verificarToken } from '../middleware/auth'

const router = Router()

router.post('/registar', registar)
router.post('/login',    login)
router.get('/perfil',    verificarToken, perfil)

export default router