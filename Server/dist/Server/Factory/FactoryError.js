"use strict";
//interfaccia e classi utilizzate per sostituire/o integrare la libreria status-code
Object.defineProperty(exports, "__esModule", { value: true });
class StatusOK {
    stampaMex() {
        return "status is okay";
    }
}
class NonAutorizzato {
    stampaMex() {
        return "l'utente non è autorizzato";
    }
}
class ClientErrorNotFound {
    stampaMex() {
        return "Error";
    }
}
class ErroGenerico {
    stampaMex() {
        return "l'errore è generico";
    }
}
var ErroriEn;
(function (ErroriEn) {
    ErroriEn[ErroriEn["OK"] = 200] = "OK";
    ErroriEn[ErroriEn["UNH"] = 401] = "UNH";
    ErroriEn[ErroriEn["NOTF"] = 404] = "NOTF";
})(ErroriEn || (ErroriEn = {}));
class ErrorMessaggio {
    constructor() { }
    getErrore(type) {
        let variabile = new ErroGenerico();
        switch (type) {
            case ErroriEn.OK:
                variabile = new StatusOK();
                break;
            case ErroriEn.UNH:
                variabile = new NonAutorizzato();
                break;
            case ErroriEn.NOTF:
                variabile = new ClientErrorNotFound();
                break;
        }
        return variabile;
    }
}
const prova = new ErrorMessaggio();
exports.default = prova;
console.log(prova.getErrore(200).stampaMex());
