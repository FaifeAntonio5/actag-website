import { Router } from 'express'
import { enviarContacto, listarContactos, eliminarContacto } from '../controllers/contacto.controller'
import { verificarToken } from '../middleware/auth'

const router = Router()

// Enviar mensagem é público (formulário do site)
router.post('/', enviarContacto)

// Listar e eliminar só para admin
//router.get('/',       verificarToken, listarContactos)
router.get('/', listarContactos)
//router.delete('/:id', verificarToken, eliminarContacto)
router.delete('/:id', eliminarContacto)

export default router