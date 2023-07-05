import express from 'express'
import usContr from '../controller/controllerUser'   

const router = express.Router()

router.post('/nome', usContr.create)
router.get('/tutti', usContr.getAll)

export default router