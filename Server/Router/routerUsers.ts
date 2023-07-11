import express from 'express'
import controller from '../Controller/controllerUser'  
import middlex from '../Middelware/middleuser' 

const router = express.Router()


router.post('/login',controller.login)
router.post('/new', controller.newUser)
router.get('/all', controller.getAll)
router.delete('/delete',middlex.controllo_token,middlex.isProprietario, controller.eliminaUserById)
router.put('/update',middlex.controllo_token,middlex.isProprietario, controller.aggiornaUtente)


router.get('/creditoresiduo', middlex.controllo_token, middlex.isProprietario,controller.ottieniCredito)
router.post('/ricaricacredito', middlex.controllo_token, middlex.controllo_admin, controller.ricaricaCredito)


//router.post('/nuovo',controller.new_user)


/*
CRUD SEMPLICI SENZA AUTENTICAZIONE
1) l'utente deve vedere il suo credito
2) l'utente che può ricaricare i crediti
*/

export default router