import controller from '../Controller/controllerModel'
import express from 'express'
import middlex from '../Middelware/middlemodel'

const router = express.Router()

router.get('/all',controller.getAll)// rotta che permette di ottenere tutti i modelli
      .post('/new',controller.newModel)//rtta che permette di creare un nuovo modello
      .delete('/delete', controller.eliminaModelloById)//rotta che permette di eliminare un modello via id
      .put('/update', controller.aggiornaModello)//rotta che permette di aggiornare un modello via id
      .post('/inferenza',middlex.controllo_token, middlex.isProprietario,controller.inferenza)//rotta che permettedi fare inferenza
      .get('/stato/:job', middlex.controllo_token, controller.ottieniStato)//rotta che permette di ottenere lo stato del job passando il job_id
      .get('/risultato/:job', middlex.controllo_token, controller.ottieniRisultato)//rotta che permette di ottenere il risultato del job

export default router