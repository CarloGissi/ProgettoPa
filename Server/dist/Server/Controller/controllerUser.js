"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yup = __importStar(require("yup"));
const http_status_codes_1 = require("http-status-codes");
const user_1 = __importDefault(require("../Model/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//creato schema per fare l'accesso
const accesSchema = yup.object({
    nome_utente: yup.string().required(),
    password: yup.string().required()
});
//creato schema per fare l'accesso
const creditoSchemaRicarica = yup.object({
    email: yup.string().required(),
    credito: yup.number().min(0).max(1000).required(),
});
//schema utile per aggiungere un nuovo utente
const userSchema = yup.object({
    nome_utente: yup.string().required(),
    email: yup.string().required(),
    password: yup.string().required(),
    admin: yup.boolean().optional()
});
//schema per aggiornare un utente
const aggSchemaUser = yup.object({
    nome_utente: yup.string().optional(),
    email: yup.string().optional(),
    password: yup.string().optional()
});
//funzione che permette di creare un nuovo utente
const newUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //se lo schema non è rispettato parte l'eccezione della validazione
        if (!req.body || Object.keys(req.body).length === 0 || Object.keys(req.body).length === 1 || Object.keys(req.body).length === 2) {
            return res.status(400).json({ error: 'Il body della richiesta è vuoto.' });
        }
        else {
            //creiamo una variabile per poter riprendere i valori della validazione
            const valore = userSchema.validate(req.body);
            const modello_user = {
                nome_utente: (yield valore).nome_utente,
                email: (yield valore).email,
                password: (yield valore).password,
                admin: (yield valore).admin
            };
            try {
                const NEW_USER = yield user_1.default.create(modello_user);
                return res.status(http_status_codes_1.StatusCodes.CREATED).json(NEW_USER);
            }
            catch (error) {
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Ritentare" });
            }
        }
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Ritentare" });
    }
});
//funzione che permette di visualizzare tutti gli utenti
const getAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ALL = yield user_1.default.findAll();
        return res.status(http_status_codes_1.StatusCodes.OK).json(ALL);
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Ritentare" });
    }
});
//funzione che ritorna un utente in base all'id specificato
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findByPk(id);
    return user;
});
//funzione che effettua il login per l'autenticazione e rilascia un token 
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body || Object.keys(req.body).length === 0 || Object.keys(req.body).length === 1) {
            return res.status(400).json({ error: 'Il body della richiesta è vuoto.' });
        }
        else {
            const valore = accesSchema.validate(req.body);
            const us = yield user_1.default.findOne({ where: { nome_utente: (yield valore).nome_utente } });
            if (us) {
                if ((yield valore).password === (us === null || us === void 0 ? void 0 : us.getDataValue('password'))) {
                    const token = jsonwebtoken_1.default.sign({ id: us === null || us === void 0 ? void 0 : us.get("id") }, process.env.KEY || 'ciao', { expiresIn: "1h" });
                    return res.json({ result: token });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ error: "Password errata" });
                }
            }
            else {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ error: "Utente non presente" });
            }
        }
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Ritentare" });
    }
});
//funzione che permette di aggiornare un utente
const aggiornaUtente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const presente = yield user_1.default.findOne({ where: { id: req.query.id } });
        if (presente) {
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ error: 'Il body della richiesta è vuoto.' });
            }
            else {
                const valore = aggSchemaUser.validate(req.body);
                const modelloUser = {
                    nome_utente: (yield valore).nome_utente,
                    email: (yield valore).email,
                    password: (yield valore).password
                };
                const user_agg = yield user_1.default.update(modelloUser, { where: { id: req.query.id } });
                return res.status(http_status_codes_1.StatusCodes.OK).json({ result: 'Utente aggiornato' });
            }
        }
        else {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ result: 'Utente non presente' });
        }
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Ritentare" });
    }
});
//funzione che permette di eliminare un utente a seconda dell'id passato
const eliminaUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findOne({ where: { id: req.query.id } });
        if (user) {
            const OLD_USER = yield user_1.default.destroy({ where: { id: req.query.id } });
            return res.status(http_status_codes_1.StatusCodes.CREATED).json({ result: "Utente eliminato" });
        }
        else {
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "L'utente non è presente" });
        }
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Ritentare" });
    }
});
//funzione che controlla il credito di un utente in base al suo nome utente
const ottieniCredito = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const us = yield user_1.default.findOne({ where: { id: req.params.id } });
        if (us) {
            const credito_residuo = us.getDataValue('credito');
            return res.status(http_status_codes_1.StatusCodes.OK).json({ credito: credito_residuo });
        }
        else {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: "L'utente non esiste" });
        }
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Ritentare" });
    }
});
//funzione che ricarica il credito di un utente in base al suo id
const ricaricaCredito = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body || Object.keys(req.body).length === 0 || Object.keys(req.body).length === 1) {
            return res.status(400).json({ error: 'Il body della richiesta è vuoto.' });
        }
        else {
            const valore = creditoSchemaRicarica.validate(req.body);
            const nuovo_credito = (yield valore).credito;
            const utente = yield user_1.default.findOne({ where: { email: (yield valore).email } });
            if (utente) {
                const credito_residuo = utente.getDataValue('credito');
                if (credito_residuo === 1000) {
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: "Il credito è massimo" });
                }
                else {
                    const somma = nuovo_credito + credito_residuo;
                    if (somma > 1000) {
                        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: "Il credito inserito supera il limite" });
                    }
                    else {
                        yield utente.update({ credito: somma });
                        return res.status(http_status_codes_1.StatusCodes.OK).json({ result: "Ricarica effettuata" });
                    }
                }
            }
            else {
                return res.json({ error: "L'utente non esiste" });
            }
        }
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
});
const ottieniCreditoByID = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findByPk(id);
    const credito = yield (user === null || user === void 0 ? void 0 : user.getDataValue('credito'));
    return credito;
});
//per esportazione
const usContr = {
    newUser,
    getAll,
    login,
    getById,
    aggiornaUtente,
    eliminaUserById,
    ottieniCredito,
    ricaricaCredito,
    ottieniCreditoByID
};
exports.default = usContr;
