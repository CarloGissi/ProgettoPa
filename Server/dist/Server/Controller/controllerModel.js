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
const model_1 = __importDefault(require("../Model/model"));
const controllerUser_1 = __importDefault(require("../Controller/controllerUser"));
const http_status_codes_1 = require("http-status-codes");
const yup = __importStar(require("yup"));
const axios_1 = __importDefault(require("axios"));
//creazione dello schema per leggere il modello dal json
const schemaModel = yup.object({
    nome: yup.string().required(),
    datasetid: yup.number().typeError('Devi inserire un numero').required(),
    userid: yup.number().typeError('Devi inserire un numero').required()
});
//creazione dello schema per leggere le modifiche da fare su modello
const aggSchemaModel = yup.object({
    nome: yup.string().optional(),
    datasetid: yup.number().typeError('Devi inserire un numero').optional()
});
//funzione che ritorno tutti i modelli in base all'id di un utente
const getAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const all = yield model_1.default.findAll(); //{where:{userid: req.query.userid}}//{paranoid:false} per mostrare i record eliminati logicamente
        return res.json(all);
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
});
//funzione per creare un nuovo modello
const newModel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //se lo schema non è rispettato parte l'eccezione della validazione
        if (!req.body || Object.keys(req.body).length === 0 || Object.keys(req.body).length === 1 || Object.keys(req.body).length === 2) {
            return res.status(400).json({ error: 'Il body della richiesta è vuoto.' });
        }
        else {
            //creiamo una variabile per poter riprendere i valori della validazione
            const valore = schemaModel.validate(req.body);
            const modelloModel = {
                nome: (yield valore).nome,
                datasetid: (yield valore).datasetid,
                userid: (yield valore).userid
            };
            try {
                const newModel = yield model_1.default.create(modelloModel);
                return res.status(http_status_codes_1.StatusCodes.CREATED).json(newModel);
            }
            catch (error) {
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Ritenta" });
            }
        }
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Ritenta" });
    }
});
//funzione che aggiorna il modello
const aggiornaModello = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const presente = yield model_1.default.findOne({ where: { id: req.query.id } });
        if (presente) {
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ error: 'Il body della richiesta è vuoto.' });
            }
            else {
                const valore = aggSchemaModel.validate(req.body);
                const modello_model = {
                    nome: (yield valore).nome,
                    datsetid: (yield valore).datasetid
                };
                const model_agg = yield model_1.default.update(modello_model, { where: { id: req.query.id } });
                return res.status(http_status_codes_1.StatusCodes.OK).json({ stato: 'Modello aggiornato' });
            }
        }
        else {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ error: 'Modello non presente' });
        }
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Ritenta" });
    }
});
//funzione che prende un modello in base al suo id
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const model = yield model_1.default.findByPk(id);
    return model;
});
//funzione che elimina un modello a seconda dell'id passato
const eliminaModelloById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const modello = yield model_1.default.findOne({ where: { id: req.query.id } });
        if (modello) {
            const OLD_MODEL = yield model_1.default.destroy({ where: { id: req.query.id } });
            return res.status(http_status_codes_1.StatusCodes.CREATED).json({ result: "Modello eliminato" });
        }
        else {
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Il modello non è presente" });
        }
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Ritenta" });
    }
});
//funzione che avvia un'inferennza e ottiene l'id del task come risposta
const inferenza = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body || Object.keys(req.body).length === 0 || Object.keys(req.body).length === 1 || Object.keys(req.body).length === 2 || Object.keys(req.body).length === 3) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: "Completa il body" });
        }
        const tipo = req.body.tipo;
        const userid = req.body.userid;
        const did = req.body.did;
        if (tipo == "0") {
            if (yield verificaCredito(userid, 1)) {
                const valore = yield axios_1.default.get("http://produttore:5000/inferenza/" + userid.toString() + "/" + did.toString() + "/" + tipo.toString(), { params: {} });
                yield rimuvoiCredito(userid, 1);
                return res.status(http_status_codes_1.StatusCodes.OK).json({ id: valore.data.job_id });
            }
            else {
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Credito insufficiente" });
            }
        }
        else if (tipo == 1) {
            if (yield verificaCredito(userid, 20)) {
                const valore = yield axios_1.default.get("http://produttore:5000/inferenza/" + userid.toString() + "/" + did.toString() + "/" + tipo.toString(), { params: {} });
                yield rimuvoiCredito(userid, 20);
                return res.status(http_status_codes_1.StatusCodes.OK).json({ id: valore.data.job_id });
            }
            else {
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Credito insufficiente" });
            }
        }
        else {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: "Inserisci correttamente il tipo" });
        }
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Ritenta" });
    }
});
const verificaCredito = (id, numeroFile) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield controllerUser_1.default.getById(id);
    const credito = yield (user === null || user === void 0 ? void 0 : user.getDataValue('credito'));
    if (credito > 3 * numeroFile) {
        return true;
    }
    else {
        return false;
    }
});
//funzione per ottenere lo stato
const ottieniStato = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const job = req.params.job;
        const valore = yield axios_1.default.get("http://produttore:5000/job-status/" + job.toString(), { params: {} });
        return res.status(http_status_codes_1.StatusCodes.OK).json({ id: job, stato: valore.data.status });
    }
    catch (error) {
    }
});
//funzione per ottenere il risultato
const ottieniRisultato = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const job = req.params.job;
        const valore = yield axios_1.default.get("http://produttore:5000/job-status/" + job.toString(), { params: {} });
        return res.status(http_status_codes_1.StatusCodes.OK).json({ id: job, risultato: valore.data.result });
    }
    catch (error) {
    }
});
const rimuvoiCredito = (id, numeroFile) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield controllerUser_1.default.getById(id);
    const credito_residuo = user === null || user === void 0 ? void 0 : user.getDataValue('credito');
    if (numeroFile === 1) {
        const costo = 3 * numeroFile;
        const nuovo_credito = credito_residuo - costo;
        yield user.update({ credito: nuovo_credito });
    }
    else if (numeroFile === 20) {
        const costo = 2.5 * numeroFile;
        const nuovo_credito = credito_residuo - costo;
        yield user.update({ credito: nuovo_credito });
    }
});
//per esportazione
const allVariable = {
    getAll,
    newModel,
    eliminaModelloById,
    aggiornaModello,
    getById,
    inferenza,
    ottieniStato,
    ottieniRisultato
};
exports.default = allVariable;
