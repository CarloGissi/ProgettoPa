import controller from '../Controller/controllerDataset'
import express from 'express'
import middlex from '../Middelware/middledataset'

const router = express.Router()

router.get('/all',controller.getAll)//rotta per ottenere tutti i datasets
router.post('/new',middlex.controllo_token,controller.newDataset)//rotta per creare un nuovo datatset
router.delete('/delete', middlex.controllo_token, middlex.isProprietario,controller.eliminaDatasetById)//rotta che ti permette di eliminare un dataset tramite l'id
router.put('/update', middlex.controllo_token, middlex.isProprietario, controller.aggiornaDataset)//rotta che ti permette di aggiornare un dataset tramite l'id
router.post('/caricafile', middlex.controllo_token, middlex.isProprietario, controller.caricaImmagine)//rotta che ti permette di caricare un'immagine passando l'id del dataset
router.post('/caricavideo', middlex.controllo_token, middlex.isProprietario, controller.caricaVideo)//rotta che ti permette di caricare un video e dividerlo in frame passando l'id del dataset

export default router