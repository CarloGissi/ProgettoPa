import { Response, Request, NextFunction } from "express";
import Dataset  from "../Model/dataset";
import { StatusCodes } from "http-status-codes";
import * as yup from 'yup'
import { ValidationError } from "sequelize";

//creazione dello schema per leggere il dataset dal json
const schema_dataset = yup.object({
    nome: yup.string().required(),
    tags: yup.string().required(),
    uid: yup.number().typeError('Devi inserire un numero').required()    
})

const agg_schema_dataset = yup.object({
    nome: yup.string().optional(),
    tags: yup.string().optional(),
    uid: yup.number().typeError('Devi inserire un numero').optional()    
})

//funzione che ritorno tutti i datasets
const getAll = async (req:Request, res: Response, next:NextFunction ) => {
    try{
        const all = await Dataset.findAll() //{paranoid:false} per mostrare i record eliminati logicamente
        return res.json(all) 
    }catch(error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }  
}

//funzione per creare un nuovo dataset
const new_dataset = async (req:Request, res: Response, next:NextFunction ) => {
    try{
        //se lo schema non è rispettato parte l'eccezione della validazione
        schema_dataset.validate(req.body).catch(ValidationError=>{
           return res.status(StatusCodes.BAD_REQUEST).json(ValidationError)
        })
        //creiamo una variabile per poter riprendere i valori della validazione
        const valore = schema_dataset.validate(req.body)
        const modello_dataset = {
            nome: (await valore).nome,
            tags : (await valore).tags,
            uid: (await valore).uid
         }
         try{
            const NEW_DATASET = await Dataset.create(modello_dataset)
            return res.status(StatusCodes.CREATED).json(NEW_DATASET)
         }catch(error){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
         }
    }catch(error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }  
}

const aggiorna_dataset = async(req: Request, res:Response)=>{
    try{
        const presente = await Dataset.findOne({where: {id: req.query.id}})
        if(presente){
            agg_schema_dataset.validate(req.body).catch(ValidationError=>{
                return res.status(StatusCodes.BAD_REQUEST).json(ValidationError)
             })
             const valore = agg_schema_dataset.validate(req.body)
             const modello_dataset = {
                nome: (await valore).nome,
                tags : (await valore).tags,
                uid: (await valore).uid
             }
             const dataset_agg = Dataset.update(modello_dataset, {where: {id: req.query.id}})
             return res.status(StatusCodes.OK).json('Dataset aggiornato')
        }else{
            return res.status(StatusCodes.NOT_FOUND).json('Dataset non presente')
        }

    }catch(error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)

    }
}

const getById = async(id:number)=>{
    const dataset = await Dataset.findByPk(id)
    return dataset
}

const delete_dataset_by_id = async (req:Request, res: Response, next:NextFunction ) => {
    try{
        const dataset = await Dataset.findOne({where: {id: req.query.id}})
        if(dataset){
            const OLD_DATASET = await Dataset.destroy({where:{id: req.query.id}})
            return res.status(StatusCodes.CREATED).json(OLD_DATASET)
        }else{
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Il dataset non è presente")
        }
    }catch(error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }  
}


const allVariable={
    getAll,
    new_dataset,
    delete_dataset_by_id,
    aggiorna_dataset
}

export default allVariable