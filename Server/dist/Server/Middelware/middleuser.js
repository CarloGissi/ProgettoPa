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
const controllerUser_1 = __importDefault(require("../Controller/controllerUser"));
const http_status_codes_1 = require("http-status-codes");
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
                req.params.id = check.id;
                next();
            }
        });
    }
});
const controllo_admin = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const USER = yield controllerUser_1.default.getById(parseInt(request.params.id));
    if ((USER === null || USER === void 0 ? void 0 : USER.get("admin")) === true) {
        next();
    }
    else {
        response.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ error: FactoryError_1.default.getErrore(401).stampaMex() });
    }
});
const isProprietario = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const USERID = req.query.id;
    try {
        const user = yield controllerUser_1.default.getById(parseInt(USERID));
        if (!user) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: 'Utente non trovato.' });
        }
        const userID = req.params.id;
        if (user.id == userID) {
            next();
        }
        else {
            res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
                message: "Non sei il proprietario."
            });
        }
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: "Ritentare" });
    }
});
// Controllo dei crediti di un'utente  per il caricamento dei files
const controllo_crediti = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const crediti = yield controllerUser_1.default.ottieniCreditoByID(request.params.uid);
    if (request.query.tipo === 0) {
        if (crediti >= 11) {
            next();
        }
        else {
            response.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send({ erro: FactoryError_1.default.getErrore(401).stampaMex() });
        }
    }
    else if (request.query.tipo === 1) {
        if (crediti >= (0.05 * 20)) {
            next();
        }
        else {
            response.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send({ message: 'Crediti non sufficienti.' });
        }
    }
});
const middlex = {
    controllo_token,
    controllo_admin,
    isProprietario,
    controllo_crediti
};
exports.default = middlex;
