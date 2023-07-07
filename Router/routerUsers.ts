import express from 'express'
import controller from '../Controller/controllerUser'   

const router = express.Router()

router.post('/new', controller.new_user)
router.get('/all', controller.getAll)
router.post('/login',controller.login)


//router.post('/nuovo',controller.new_user)


/*
CRUD SEMPLICI SENZA AUTENTICAZIONE
1) l'utente deve vedere il suo credito
2) l'utente che può ricaricare i crediti
*/

export default router