import express from 'express'
import controller from '../Controller/controllerUser'  
import middlex from '../Middelware/middleuser' 

const router = express.Router()

//rotte semplici senza controllo
router.post('/login',controller.login)//per effettuare il login ed ottenere il token
      .post('/new', controller.newUser)//per creare un nuovo utente
      .get('/all', controller.getAll)//per ottenere tutti gli utenti nel db
      .delete('/delete',middlex.controllo_token,middlex.isProprietario, controller.eliminaUserById)//per eliminare l'utente inserendo l'id
      .put('/update',middlex.controllo_token,middlex.isProprietario, controller.aggiornaUtente)//per aggiornare l'utente inserendo l'id


      //rotte con autentificazione(controllo token), e controllo su proprietario e admin
router.get('/creditoresiduo', middlex.controllo_token, middlex.isProprietario,controller.ottieniCredito)
router.post('/ricaricacredito', middlex.controllo_token, middlex.controllo_admin, controller.ricaricaCredito)



export default router