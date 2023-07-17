"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controllerDataset_1 = __importDefault(require("../Controller/controllerDataset"));
const express_1 = __importDefault(require("express"));
const middledataset_1 = __importDefault(require("../Middelware/middledataset"));
const router = express_1.default.Router();
router.get('/all', controllerDataset_1.default.getAll); //rotta per ottenere tutti i datasets
router.post('/new', middledataset_1.default.controllo_token, controllerDataset_1.default.newDataset); //rotta per creare un nuovo datatset
router.delete('/delete', middledataset_1.default.controllo_token, middledataset_1.default.isProprietario, controllerDataset_1.default.eliminaDatasetById); //rotta che ti permette di eliminare un dataset tramite l'id
router.put('/update', middledataset_1.default.controllo_token, middledataset_1.default.isProprietario, controllerDataset_1.default.aggiornaDataset); //rotta che ti permette di aggiornare un dataset tramite l'id
router.post('/caricafile', middledataset_1.default.controllo_token, middledataset_1.default.isProprietario, controllerDataset_1.default.caricaImmagine); //rotta che ti permette di caricare un'immagine passando l'id del dataset
router.post('/caricavideo', middledataset_1.default.controllo_token, middledataset_1.default.isProprietario, controllerDataset_1.default.caricaVideo); //rotta che ti permette di caricare un video e dividerlo in frame passando l'id del dataset
exports.default = router;
