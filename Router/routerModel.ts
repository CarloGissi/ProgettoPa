import controller from '../Controller/controllerModel'
import express from 'express'

const router = express.Router()

router.get('/all',controller.getAll)
      .post('/new',controller.newModel)
      .delete('/delete', controller.eliminaModelloById)
      .post('/update', controller.aggiornaModello)

export default router