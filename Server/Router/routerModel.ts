import controller from '../Controller/controllerModel'
import express from 'express'
import middlex from '../Middelware/middlemodel'

const router = express.Router()

router.get('/all',controller.getAll)
      .post('/new',controller.newModel)
      .delete('/delete', controller.eliminaModelloById)
      .put('/update', controller.aggiornaModello)
      .post('/inferenza',middlex.controllo_token, middlex.isProprietario,controller.inferenza)
      .get('/stato/:job', middlex.controllo_token, controller.ottieniStato)
      .get('/risultato/:job', middlex.controllo_token, controller.ottieniRisultato)

export default router