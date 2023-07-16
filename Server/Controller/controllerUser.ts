import {Request, Response, NextFunction} from 'express'
import * as  yup from 'yup'
import {StatusCodes} from 'http-status-codes'
import User from '../Model/user'
import jwt from 'jsonwebtoken'
import { STATUS_CODES } from 'http'

//creato schema per fare l'accesso
const accesSchema = yup.object({
    nome_utente: yup.string().required(),
    password: yup.string().required()
    })

//creato schema per fare l'accesso
const creditoSchemaRicarica = yup.object({
    email: yup.string().required(),
    credito: yup.number().min(0).max(1000).required(),
    })
//schema utile per aggiungere un nuovo utente
const userSchema = yup.object({
    nome_utente: yup.string().required(),
    email: yup.string().required(),
    password: yup.string().required(),
    admin: yup.boolean().optional()
    })

//schema per aggiornare un utente
const aggSchemaUser = yup.object({
    nome_utente: yup.string().optional(),
    email: yup.string().optional(),
    password: yup.string().optional()   
})


//funzione che permette di creare un nuovo utente
const newUser = async (req:Request, res: Response, next:NextFunction ) => {
    try{
        //se lo schema non è rispettato parte l'eccezione della validazione
        if (!req.body || Object.keys(req.body).length === 0 || Object.keys(req.body).length === 1 || Object.keys(req.body).length === 2) {
            return res.status(400).json({ error: 'Il body della richiesta è vuoto.' })}
        else{
            //creiamo una variabile per poter riprendere i valori della validazione
            const valore = userSchema.validate(req.body)
            const modello_user = {
                nome_utente: (await valore).nome_utente,
                email : (await valore).email,
                password: (await valore).password,
                admin: (await valore).admin
                }
                try{
                const NEW_USER = await User.create(modello_user)
                return res.status(StatusCodes.CREATED).json(NEW_USER)
                }catch(error){
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Ritentare"})
                }
        }
       }catch(error){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Ritentare"})
       }
} 



//funzione che permette di visualizzare tutti gli utenti
const getAll = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const ALL = await User.findAll()
        return res.status(StatusCodes.OK).json(ALL)
    }catch(error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Ritentare"})
    }
}

//funzione che ritorna un utente in base all'id specificato
const getById = async(id:number)=>{
    const user = await User.findByPk(id)
    return user
}

//funzione che effettua il login per l'autenticazione e rilascia un token 
const login = async(req: Request, res:Response)=>{
    try{
        if (!req.body || Object.keys(req.body).length === 0 || Object.keys(req.body).length === 1) {
            return res.status(400).json({ error: 'Il body della richiesta è vuoto.' })}
        else{
            const valore = accesSchema.validate(req.body)
            const us = await User.findOne({where:{nome_utente: (await valore).nome_utente}})
            if(us){
                if((await valore).password===us?.getDataValue('password')){
                    const token = jwt.sign({id: us?.get("id") }, process.env.KEY || 'ciao', { expiresIn: "1h" })
                    return res.json({result:token})
                }else{
                    res.status(StatusCodes.UNAUTHORIZED).json({error:"Password errata"})
                }
            }else{
                res.status(StatusCodes.NOT_FOUND).json({error:"Utente non presente"})
            }
        }        
    }catch(error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Ritentare"})
    }

}

//funzione che permette di aggiornare un utente
const aggiornaUtente = async(req: Request, res:Response)=>{
    try{
        const presente = await User.findOne({where: {id: req.query.id}})
        if(presente){
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ error: 'Il body della richiesta è vuoto.' })}
            else{
                const valore = aggSchemaUser.validate(req.body)
                const modelloUser = {
                    nome_utente: (await valore).nome_utente,
                    email : (await valore).email,
                    password: (await valore).password
                }
                const user_agg = await User.update(modelloUser, {where: {id: req.query.id}})
                return res.status(StatusCodes.OK).json({result:'Utente aggiornato'})
            }
        }else{
            return res.status(StatusCodes.NOT_FOUND).json({result:'Utente non presente'})
        }

    }catch(error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Ritentare"})

    }
}

//funzione che permette di eliminare un utente a seconda dell'id passato
const eliminaUserById = async (req:Request, res: Response, next:NextFunction ) => {
    try{
        const user = await User.findOne({where: {id: req.query.id}})
        if(user){
            const OLD_USER = await User.destroy({where:{id: req.query.id}})
            return res.status(StatusCodes.CREATED).json({result: "Utente eliminato"})
        }else{
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "L'utente non è presente"})
        }
    }catch(error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Ritentare"})
    }  
}

//funzione che controlla il credito di un utente in base al suo nome utente
const ottieniCredito =async (req: Request, res:Response, next:NextFunction) => {
    try{
        const us = await User.findOne({where:{id: (req as any).params.id}})
        if(us){
            const credito_residuo = us.getDataValue('credito')
            return res.status(StatusCodes.OK).json({credito: credito_residuo})
        }else{
            return res.status(StatusCodes.BAD_REQUEST).json({error:"L'utente non esiste"})
        }
    }catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Ritentare"})
    }
}

//funzione che ricarica il credito di un utente in base al suo id
const ricaricaCredito = async(req:Request, res:Response)=>{
    try{
        if (!req.body || Object.keys(req.body).length === 0 || Object.keys(req.body).length === 1) {
            return res.status(400).json({ error: 'Il body della richiesta è vuoto.' })}
        else{
            const valore = creditoSchemaRicarica.validate(req.body)
            const nuovo_credito = (await valore).credito
            const utente = await User.findOne({where:{email: (await valore).email}})        
            if(utente){
                const credito_residuo = utente.getDataValue('credito')
                if(credito_residuo===1000){
                    return res.status(StatusCodes.BAD_REQUEST).json({error: "Il credito è massimo"})
                }else{
                    const somma = nuovo_credito + credito_residuo
                    if(somma >1000){
                        return res.status(StatusCodes.BAD_REQUEST).json({error:"Il credito inserito supera il limite"})
                    }else{
                        await utente.update({credito: somma})
                        return res.status(StatusCodes.OK).json({result:"Ricarica effettuata"})
                    }
                }
            }else{
                return res.json({error:"L'utente non esiste"})
            }
        }
    }catch(error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}

const ottieniCreditoByID = async(id: number)=>{
    const user = await User.findByPk(id)
    const credito = await user?.getDataValue('credito')
    return credito
}

//per esportazione
const usContr={
    newUser,
    getAll,
    login,
    getById,
    aggiornaUtente,
    eliminaUserById,
    ottieniCredito,
    ricaricaCredito,
    ottieniCreditoByID
}
export default  usContr