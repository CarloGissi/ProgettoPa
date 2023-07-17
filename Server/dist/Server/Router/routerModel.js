"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controllerModel_1 = __importDefault(require("../Controller/controllerModel"));
const express_1 = __importDefault(require("express"));
const middlemodel_1 = __importDefault(require("../Middelware/middlemodel"));
const router = express_1.default.Router();
router.get('/all', controllerModel_1.default.getAll) // rotta che permette di ottenere tutti i modelli
    .post('/new', controllerModel_1.default.newModel) //rtta che permette di creare un nuovo modello
    .delete('/delete', controllerModel_1.default.eliminaModelloById) //rotta che permette di eliminare un modello via id
    .put('/update', controllerModel_1.default.aggiornaModello) //rotta che permette di aggiornare un modello via id
    .post('/inferenza', middlemodel_1.default.controllo_token, middlemodel_1.default.isProprietario, controllerModel_1.default.inferenza) //rotta che permettedi fare inferenza
    .get('/stato/:job', middlemodel_1.default.controllo_token, controllerModel_1.default.ottieniStato) //rotta che permette di ottenere lo stato del job passando il job_id
    .get('/risultato/:job', middlemodel_1.default.controllo_token, controllerModel_1.default.ottieniRisultato); //rotta che permette di ottenere il risultato del job
exports.default = router;
