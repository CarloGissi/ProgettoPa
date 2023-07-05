import express from 'express'
import usContr from '../controller/controllerUser'   

const router = express.Router()

router.post('/nome', usContr.create)
router.get('/tutti', usContr.getAll)


/*
CRUD SEMPLICI SENZA AUTENTICAZIONE
1) l'utente deve vedere il suo credito
2) l'utente che può ricaricare i crediti
*/

export default router