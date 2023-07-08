import {Request, Response, NextFunction} from 'express'
import * as  yup from 'yup'
import {StatusCodes} from 'http-status-codes'
import User from '../Model/user'
import jwt from 'jsonwebtoken'
import prova from '../Factory/FactoryError'

//creato schema per fare l'accesso
const accesSchema = yup.object({
    nome_utente: yup.string().required(),
    password: yup.string().required()
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
        userSchema.validate(req.body).catch(ValidationError=>{
        return res.status(StatusCodes.BAD_REQUEST).json(ValidationError)
        })
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
               return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
            }
       }catch(error){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
       }
} 



//funzione che permette di visualizzare tutti gli utenti
const getAll = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const ALL = await User.findAll()
        return res.status(StatusCodes.OK).json(ALL)
    }catch(error){
        //return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
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
        accesSchema.validate(req.body).catch(ValidationError=>{
        return res.status(StatusCodes.BAD_REQUEST).json(ValidationError)})
        const valore = accesSchema.validate(req.body)
        const us = await User.findOne({where:{nome_utente: (await valore).nome_utente}})
        if(us){
            if((await valore).password===us?.getDataValue('password')){
                const token = jwt.sign({id: us?.get("id") }, process.env.KEY || 'ciao', { expiresIn: "1h" })
                return res.json(token)
            }else{
                res.status(StatusCodes.UNAUTHORIZED).json()
            }
        }
        
    }catch(error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }

}

//funzione che permette di aggiornare un utente
const aggiornaUtente = async(req: Request, res:Response)=>{
    try{
        const presente = await User.findOne({where: {id: req.query.id}})
        if(presente){
            aggSchemaUser.validate(req.body).catch(ValidationError=>{
                return res.status(StatusCodes.BAD_REQUEST).json(ValidationError)
             })
             const valore = aggSchemaUser.validate(req.body)
             const modelloUser = {
                nome_utente: (await valore).nome_utente,
                email : (await valore).email,
                password: (await valore).password
             }
             const user_agg = User.update(modelloUser, {where: {id: req.query.id}})
             return res.status(StatusCodes.OK).json('Utente aggiornato')
        }else{
            return res.status(StatusCodes.NOT_FOUND).json('Utente non presente')
        }

    }catch(error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)

    }
}

//funzione che permette di eliminare un utente a seconda dell'id passato
const eliminaUserById = async (req:Request, res: Response, next:NextFunction ) => {
    try{
        const user = await User.findOne({where: {id: req.query.id}})
        if(user){
            const OLD_USER = await User.destroy({where:{id: req.query.id}})
            return res.status(StatusCodes.CREATED).json(OLD_USER)
        }else{
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("L'utente non è presente")
        }
    }catch(error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }  
}

//per esportazione
const usContr={
    newUser,
    getAll,
    login,
    getById,
    aggiornaUtente,
    eliminaUserById

}
export default  usContr