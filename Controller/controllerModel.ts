import { Response, Request, NextFunction } from "express";
import Model  from "../Model/model";
import { StatusCodes } from "http-status-codes";
import * as yup from 'yup'
import { ValidationError } from "sequelize";

//creazione dello schema per leggere il modello dal json
const schemaModel = yup.object({
    nome: yup.string().required(),
    datasetid: yup.number().typeError('Devi inserire un numero').required(),
    userid: yup.number().typeError('Devi inserire un numero').required()    
})

//creazione dello schema per leggere le modifiche da fare su modello
const aggSchemaModel = yup.object({
    nome: yup.string().optional(),
    datasetid: yup.number().typeError('Devi inserire un numero').optional(),
    userid: yup.number().typeError('Devi inserire un numero').optional()      
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
                        datsetid : (await valore).datasetid,
                        userid: (await valore).userid
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

//per esportazione
const allVariable={
    getAll,
    newModel,
    eliminaModelloById,
    aggiornaModello,
    getById
}

export default allVariable