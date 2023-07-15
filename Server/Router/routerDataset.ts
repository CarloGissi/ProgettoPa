import controller from '../Controller/controllerDataset'
import express from 'express'
import middlex from '../Middelware/middledataset'
import middlexUser from '../Middelware/middleuser'

const router = express.Router()

router.get('/all',controller.getAll)
      .post('/new',controller.newDataset)
      .delete('/delete', middlex.controllo_token, middlex.isProprietario,controller.eliminaDatasetById)
      .put('/update', middlex.controllo_token, middlex.isProprietario, controller.aggiornaDataset)
      .post('/caricafile', middlex.controllo_token, middlex.isProprietario, controller.caricaImmagine)
      .post('/caricavideo', middlex.controllo_token, middlex.isProprietario, controller.caricaVideo)

export default router