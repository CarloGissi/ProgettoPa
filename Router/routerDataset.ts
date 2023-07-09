import controller from '../Controller/controllerDataset'
import express from 'express'
import middlex from '../Middelware/middledataset'

const router = express.Router()

router.get('/all',controller.getAll)
      .post('/new',controller.newDataset)
      .delete('/delete', middlex.controllo_token, middlex.isProprietario,controller.eliminaDatasetById)
      .put('/update', middlex.controllo_token, middlex.isProprietario, controller.aggiornaDataset)

export default router