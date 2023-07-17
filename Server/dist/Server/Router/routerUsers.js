"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllerUser_1 = __importDefault(require("../Controller/controllerUser"));
const middleuser_1 = __importDefault(require("../Middelware/middleuser"));
const router = express_1.default.Router();
//rotte semplici senza controllo
router.post('/login', controllerUser_1.default.login) //per effettuare il login ed ottenere il token
    .post('/new', controllerUser_1.default.newUser) //per creare un nuovo utente
    .get('/all', controllerUser_1.default.getAll) //per ottenere tutti gli utenti nel db
    .delete('/delete', middleuser_1.default.controllo_token, middleuser_1.default.isProprietario, controllerUser_1.default.eliminaUserById) //per eliminare l'utente inserendo l'id
    .put('/update', middleuser_1.default.controllo_token, middleuser_1.default.isProprietario, controllerUser_1.default.aggiornaUtente); //per aggiornare l'utente inserendo l'id
//rotte con autentificazione(controllo token), e controllo su proprietario e admin
router.get('/creditoresiduo', middleuser_1.default.controllo_token, middleuser_1.default.isProprietario, controllerUser_1.default.ottieniCredito);
router.post('/ricaricacredito', middleuser_1.default.controllo_token, middleuser_1.default.controllo_admin, controllerUser_1.default.ricaricaCredito);
exports.default = router;
