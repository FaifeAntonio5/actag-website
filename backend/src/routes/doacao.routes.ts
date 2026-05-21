import { Router } from 'express'
import { registarDoacao, listarDoacoes, totalDoacoes } from '../controllers/doacao.controller'
import { verificarToken } from '../middleware/auth'

const router = Router()

// Registar doação é público (página de doação do site)
router.post('/', registarDoacao)

// Listar e ver totais só para admin
//router.get('/',       verificarToken, listarDoacoes)
router.get('/', listarDoacoes)
//router.get('/total',  verificarToken, totalDoacoes)
router.get('/total', totalDoacoes)

export default router