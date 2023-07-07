import contrData from '../Controller/controllerDataset'
import express from 'express'

const router = express.Router()

router.get('/all',contrData.getAll)
      .post('/new',contrData.new_dataset)
      .delete('/:id', contrData.delete_dataset_by_id)

export default router