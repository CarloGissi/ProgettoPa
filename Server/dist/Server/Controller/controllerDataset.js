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
const dataset_1 = __importDefault(require("../Model/dataset"));
const http_status_codes_1 = require("http-status-codes");
const yup = __importStar(require("yup"));
const multer_1 = __importStar(require("multer"));
const controllerUser_1 = __importDefault(require("./controllerUser"));
const fs = __importStar(require("fs"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
//creazione dello schema per leggere il dataset dal json
const schemaDataset = yup.object({
    nome: yup.string().required(),
    tags: yup.string().required(),
    uid: yup.number().typeError('Devi inserire un numero').required()
});
//creazione dello schema per poter leggere i dati da un json
const aggSchemaDataset = yup.object({
    nome: yup.string().optional(),
    tags: yup.string().optional()
});
//funzione che ritorno tutti i datasets dello stesso utente
const getAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const all = yield dataset_1.default.findAll(); //{where: {uid: req.query.uid}}//{paranoid:false} per mostrare i record eliminati logicamente
        return res.json(all);
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
});
//funzione per creare un nuovo dataset
const newDataset = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //se lo schema non è rispettato parte l'eccezione della validazione
        if (!req.body || Object.keys(req.body).length === 0 || Object.keys(req.body).length === 1 || Object.keys(req.body).length === 2) {
            return res.status(400).json({ error: 'Il body della richiesta è vuoto.' });
        }
        //creiamo una variabile per poter riprendere i valori della validazione
        const valore = schemaDataset.validate(req.body);
        const modello_dataset = {
            nome: (yield valore).nome,
            tags: (yield valore).tags,
            uid: (yield valore).uid
        };
        try {
            const NEW_DATASET = yield dataset_1.default.create(modello_dataset);
            return res.status(http_status_codes_1.StatusCodes.CREATED).json(NEW_DATASET);
        }
        catch (error) {
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Ritenta" });
        }
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Ritenta" });
    }
});
//funzione per aggioranre un ndataset in base all'id
const aggiornaDataset = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const presente = yield dataset_1.default.findOne({ where: { id: req.query.id } });
        if (presente) {
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ error: 'Il body della richiesta è vuoto.' });
            }
            else {
                const valore = aggSchemaDataset.validate(req.body);
                const modello_dataset = {
                    nome: (yield valore).nome,
                    tags: (yield valore).tags
                };
                const dataset_agg = yield dataset_1.default.update(modello_dataset, { where: { id: req.query.id } });
                return res.status(http_status_codes_1.StatusCodes.OK).json({ result: 'Dataset aggiornato' });
            }
        }
        else {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ error: 'Dataset non presente, inserire id corretto' });
        }
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Ritenta" });
    }
});
//funzione che ritorna un dataset in base all'id passato
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const dataset = yield dataset_1.default.findByPk(id);
    return dataset;
});
//funzione che elimina un dataset in base all'id passato
const eliminaDatasetById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dataset = yield dataset_1.default.findOne({ where: { id: req.query.id } });
        if (dataset) {
            const OLD_DATASET = yield dataset_1.default.destroy({ where: { id: req.query.id } });
            return res.status(http_status_codes_1.StatusCodes.CREATED).json({ stato: "dataset eliminato" });
        }
        else {
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Il dataset non è presente" });
        }
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Ritenta" });
    }
});
const verificaCredito = (id, numeroFile) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield controllerUser_1.default.getById(id);
    const credito = user === null || user === void 0 ? void 0 : user.getDataValue('credito');
    if (credito > 0.05 * numeroFile) {
        return true;
    }
    else {
        return false;
    }
});
function convertTimestampToString(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
}
const rimuvoiCredito = (id, numeroFile) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield controllerUser_1.default.getById(id);
    const credito_residuo = user === null || user === void 0 ? void 0 : user.getDataValue('credito');
    const costo = 0.05 * numeroFile;
    const nuovo_credito = credito_residuo - costo;
    yield user.update({ credito: nuovo_credito });
});
const caricaImmagine = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //creiamo la cartella se non esiste
        const cartella_dataset = './data/images/img_' + `${req.params.uid}` + '_' + `${req.query.id}` + '/';
        if (!fs.existsSync(cartella_dataset)) {
            yield fs.mkdir(cartella_dataset, { recursive: true }, err => {
                if (err) {
                    return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json(err);
                }
            });
        }
        //verifichiamo il credito dell'utente che ha effettuato l'accesso ed è proprietario del dataset
        if (yield verificaCredito(req.params.uid, 1)) {
            const storageEngine = multer_1.default.diskStorage({
                destination: (req, file, callback) => {
                    callback(null, cartella_dataset);
                },
                filename: (req, file, callback) => {
                    const timestamp = Date.now();
                    const filename = 'tmp_' + `${convertTimestampToString(timestamp)}` + '_' + file.originalname;
                    callback(null, filename);
                },
            });
            const caricamento = (0, multer_1.default)({
                storage: storageEngine,
                fileFilter: (req, file, callback) => {
                    if (file.mimetype.startsWith('image/')) {
                        callback(null, true);
                    }
                    else {
                        callback(new Error('Non ci sono immagini'));
                    }
                }
            });
            //controlliamo che l'immagine sia stata caricata
            caricamento.single('immagine')(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
                if (err instanceof multer_1.MulterError) {
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ err: "Inserimento non avvenuto: attendi..." });
                }
                else if (err) {
                    return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(err);
                }
                if (!(req.file instanceof Array) && !req.file) {
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ err: "Inserimento non avvenuto: errore" });
                }
                else {
                    rimuvoiCredito(req.params.uid, 1);
                    return res.status(http_status_codes_1.StatusCodes.OK).json({ stato: 'il file è stato caricato' });
                }
            }));
        }
        else {
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Credito insufficiente" });
        }
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Ritenta" });
    }
});
const caricaVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //creiamo la cartella se non esiste
        const cartella_dataset = './data/video/v_' + `${req.params.uid}` + '_' + `${req.query.id}` + '/';
        if (!fs.existsSync(cartella_dataset)) {
            yield fs.mkdir(cartella_dataset, { recursive: true }, err => {
                if (err) {
                    return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json(err);
                }
            });
        }
        //verifichiamo il credito dell'utente che ha effettuato l'accesso ed è proprietario del dataset
        if (yield verificaCredito(req.params.uid, 20)) {
            const storageEngine = multer_1.default.diskStorage({
                destination: (req, file, callback) => {
                    callback(null, cartella_dataset);
                },
                filename: (req, file, callback) => {
                    const timestamp = Date.now();
                    const filename = 'tmp_' + `${convertTimestampToString(timestamp)}` + '_' + file.originalname;
                    req.params.filename = filename;
                    callback(null, filename);
                },
            });
            const caricamento = (0, multer_1.default)({
                storage: storageEngine,
                fileFilter: (req, file, callback) => {
                    if (file.mimetype.startsWith('video/mp4')) {
                        callback(null, true);
                    }
                    else {
                        callback(new Error('Non ci sono video mp4'));
                    }
                }
            });
            //controlliamo che il video sia stato caricato
            caricamento.single('video')(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
                if (err instanceof multer_1.MulterError) {
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: "Richiesta errata" });
                }
                else if (err) {
                    return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Ritenta" });
                }
                if (!(req.file instanceof Array) && !req.file) {
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: "Ritenta" });
                }
                else {
                    //creiamo se non esiste la cartella dove saranno contenuti i frame
                    const cartella_frame = cartella_dataset + '/' + 'frame/'; //+req.params.filename.slice(0,-4)
                    if (!fs.existsSync(cartella_frame)) {
                        yield fs.mkdir(cartella_frame, { recursive: true }, err => {
                            if (err) {
                                return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ error: "Ritenta" });
                            }
                        });
                    }
                    const video_path = cartella_dataset + req.params.filename;
                    //prendiamo i frame con la libreria 
                    yield (0, fluent_ffmpeg_1.default)(video_path)
                        .on('filenames', (filenames) => {
                        console.log('I frame vengono estratti');
                    })
                        .on('end', () => {
                        console.log('Estrazione completata');
                    })
                        .screenshots({
                        count: 20,
                        filename: 'frame-%i.png',
                        folder: cartella_frame
                    });
                    //rimuoviamo i crediti in base ai frame che abbiamo
                    yield rimuvoiCredito(req.params.uid, 20);
                    return res.status(http_status_codes_1.StatusCodes.OK).json({ stato: 'il file è stato caricato' });
                }
            }));
        }
        else {
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Credito insufficiente" });
        }
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Ritenta" });
    }
});
//per esportazione
const allVariable = {
    getAll,
    newDataset,
    eliminaDatasetById,
    aggiornaDataset,
    getById,
    caricaImmagine,
    caricaVideo,
    rimuvoiCredito,
    verificaCredito
};
exports.default = allVariable;
