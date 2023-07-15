import controller from '../Controller/controllerModel'
import express from 'express'
import middlex from '../Middelware/middlemodel'

const router = express.Router()

router.get('/all',controller.getAll)
      .post('/new',controller.newModel)
      .delete('/delete', middlex.controllo_token, middlex.isProprietario, controller.eliminaModelloById)
      .put('/update', middlex.controllo_token, middlex.isProprietario, controller.aggiornaModello)
      .get('/inferenza',controller.inferenza)
      .get('/stato/:job', middlex.controllo_token, middlex.isProprietario,controller.ottieniStato)
      .get('/risultato/:job', controller.ottieniRisultato)

export default router