import { Response, Request, NextFunction } from "express";
import Model  from "../Model/model";
import contrDataset  from "../Controller/controllerDataset";
import contrUser from "../Controller/controllerUser"
import { StatusCodes } from "http-status-codes";
import * as yup from 'yup'
import { ValidationError } from "sequelize";
import axios from 'axios'
import { STATUS_CODES } from "http";

//creazione dello schema per leggere il modello dal json
const schemaModel = yup.object({
    nome: yup.string().required(),
    datasetid: yup.number().typeError('Devi inserire un numero').required(),
    userid: yup.number().typeError('Devi inserire un numero').required()    
})

//creazione dello schema per leggere le modifiche da fare su modello
const aggSchemaModel = yup.object({
    nome: yup.string().optional(),
    datasetid: yup.number().typeError('Devi inserire un numero').optional()     
})

//funzione che ritorno tutti i modelli in base all'id di un utente
const getAll = async (req:Request, res: Response, next:NextFunction ) => {
    try{
        const all = await Model.findAll() //{where:{userid: req.query.userid}}//{paranoid:false} per mostrare i record eliminati logicamente
        return res.json(all) 
    }catch(error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }  
}

//funzione per creare un nuovo modello
const newModel = async (req:Request, res: Response, next:NextFunction ) => {
    try{
        //se lo schema non è rispettato parte l'eccezione della validazione
        if (!req.body || Object.keys(req.body).length === 0 || Object.keys(req.body).length === 1 || Object.keys(req.body).length === 2) {
            return res.status(400).json({ error: 'Il body della richiesta è vuoto.' })}
        else{
            //creiamo una variabile per poter riprendere i valori della validazione
            const valore = schemaModel.validate(req.body)
            const modelloModel = {
                nome: (await valore).nome,
                datasetid : (await valore).datasetid,
                userid: (await valore).userid
            }
            try{
                const newModel = await Model.create(modelloModel)
                return res.status(StatusCodes.CREATED).json(newModel)
            }catch(error){
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
            }
        }
    }catch(error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }  
}
//funzione che aggiorna il modello
const aggiornaModello = async(req: Request, res:Response)=>{
    try{
        const presente = await Model.findOne({where: {id: req.query.id}})
        if(presente){
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ error: 'Il body della richiesta è vuoto.' })}
                else{
                    const valore = aggSchemaModel.validate(req.body)
                    const modello_model = {
                        nome: (await valore).nome,
                        datsetid : (await valore).datasetid
                    }
                    const model_agg = await Model.update(modello_model, {where: {id: req.query.id}})
                    return res.status(StatusCodes.OK).json('Modello aggiornato')   
                        }
        }else{
            return res.status(StatusCodes.NOT_FOUND).json('Modello non presente')
        }

    }catch(error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)

    }
}

//funzione che prende un modello in base al suo id
const getById = async(id:number)=>{
    const model = await Model.findByPk(id)
    return model
}

//funzione che elimina un modello a seconda dell'id passato
const eliminaModelloById = async (req:Request, res: Response, next:NextFunction ) => {
    try{
        const modello = await Model.findOne({where: {id: req.query.id}})
        if(modello){
            const OLD_MODEL = await Model.destroy({where:{id: req.query.id}})
            return res.status(StatusCodes.CREATED).json(OLD_MODEL)
        }else{
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Il modello non è presente")
        }
    }catch(error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }  
}

//funzione che avvia un'inferennza e ottiene l'id del task come risposta
const inferenza = async(req:Request, res: Response, next:NextFunction )=>{
    try{
        const user = await contrUser.getById((req.params as any).userid)
       if(user?.getDataValue('credito') >= 3){
        const modello = await getById((req.query as any).id)
        const idmodello = await modello?.getDataValue('id')
        if(req.params.userid === await modello?.getDataValue('userid')){
            const dataset = await contrDataset.getById((req.query as any).did)
            const iddataset = await dataset?.getDataValue('id')
            if(iddataset === await modello?.getDataValue('datasetid')){
                const valore = await axios.get("http://produttore:5000/inferenza/"+iddataset+"/"+idmodello, {params: {}})
                 await rimuvoiCredito((req.params as any).userid,1)
                return res.status(StatusCodes.OK).json({id: valore.data.job_id}) 
            }else{
                return res.status(StatusCodes.BAD_REQUEST).json('Id del dataset errato, non corrisponde con quello del modello')
            }
       }else{
        return res.status(StatusCodes.UNAUTHORIZED).json('Il tuo d non corrisponde con quello presente nel modello')
       }
        }else{
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json('Credito insufficiente')
        }
    }catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}
//funzione per ottenere lo stato
const ottieniStato = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const job = req.params.job
        const valore = await axios.get("http://produttore:5000/job-status/"+job.toString(), {params: {}})
        return res.status(StatusCodes.OK).json({id: job, stato: valore.data.status})
    }catch(error){

    }
}


//funzione per ottenere il risultato
const ottieniRisultato = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const job = req.params.job
        const valore = await axios.get("http://produttore:5000/job-status/"+job.toString(), {params: {}})
        return res.status(StatusCodes.OK).json({id: job, risultato: valore.data.result})
    }catch(error){

    }
}

const rimuvoiCredito = async(id: number, numeroFile: number)=>{
    const user = await contrUser.getById(id) as any
    const credito_residuo = user?.getDataValue('credito');
    const costo = 3*numeroFile
    const nuovo_credito = credito_residuo-costo
    await user.update({credito: nuovo_credito})
}
  

//per esportazione
const allVariable={
    getAll,
    newModel,
    eliminaModelloById,
    aggiornaModello,
    getById,
    inferenza, 
    ottieniStato, 
    ottieniRisultato
}

export default allVariable