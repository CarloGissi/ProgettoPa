import contrData from '../Controller/controllerDataset'
import express from 'express'

const router = express.Router()

router.get('/all',contrData.getAll)
      .post('/new',contrData.new_dataset)
      .delete('/delete', contrData.delete_dataset_by_id)
      .post('/update', contrData.aggiorna_dataset)

export default router