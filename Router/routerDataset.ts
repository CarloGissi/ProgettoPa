import controller from '../Controller/controllerDataset'
import express from 'express'

const router = express.Router()

router.get('/all',controller.getAll)
      .post('/new',controller.newDataset)
      .delete('/delete', controller.eliminaDatasetById)
      .post('/update', controller.aggiornaDataset)

export default router