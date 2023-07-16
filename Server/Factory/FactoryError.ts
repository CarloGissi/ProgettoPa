interface IErrorMsg{
    stampaMex():string;
}

class StatusOK implements IErrorMsg{
    stampaMex() :string{
        return "status is okay";
    }
}

class NonAutorizzato implements IErrorMsg{
    stampaMex() :string{
        return "l'utente non è autorizzato";
    }
}

class ClientErrorNotFound implements IErrorMsg{
    stampaMex() :string{
        return "l'utente non è autorizzato";
    }
}

class ErroGenerico implements IErrorMsg{
    stampaMex() :string{
        return "l'errore è generico";
    }
}

enum ErroriEn{
    OK = 200,
    UNH = 401,
    NOTF = 404
}

class ErrorMessaggio {
    constructor(){}
    getErrore(type:ErroriEn): IErrorMsg{
        let variabile:IErrorMsg = new ErroGenerico();
        switch(type){
            case ErroriEn.OK:
                variabile= new StatusOK();
                break;
            case ErroriEn.UNH:
                variabile= new NonAutorizzato();
                break;
            case ErroriEn.NOTF:
                variabile= new ClientErrorNotFound();
                break;
        }
        return variabile
    }
}


const prova: ErrorMessaggio = new ErrorMessaggio()
export default prova
console.log(prova.getErrore(200).stampaMex())