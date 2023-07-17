"use strict";
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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const controllerDataset_1 = __importDefault(require("../Controller/controllerDataset"));
const FactoryError_1 = __importDefault(require("../Factory/FactoryError"));
const controllo_token = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ error: FactoryError_1.default.getErrore(401).stampaMex() });
    }
    else {
        jsonwebtoken_1.default.verify(token, process.env.KEY || "ciao", (err) => {
            if (err) {
                return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({ error: "Token errato" });
            }
            else {
                const check = jsonwebtoken_1.default.verify(token, process.env.KEY || "ciao");
                req.params.uid = check.id;
                next();
            }
        });
    }
});
const isProprietario = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const datasetID = req.query.id;
    try {
        const dataset = yield controllerDataset_1.default.getById(parseInt(datasetID));
        if (!dataset) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: 'Dataset non trovato.' });
        }
        const userID = req.params.uid;
        if (dataset.uid == userID) {
            next();
        }
        else {
            res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
                message: 'Non sei il proprietario del dataset.'
            });
        }
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: "Ritenta" });
    }
});
const middlex = {
    controllo_token,
    isProprietario
};
exports.default = middlex;
