import {Request, Response, NextFunction} from 'express'
import * as  yup from 'yup'
import {StatusCodes} from 'http-status-codes'
import User from '../Model/user'
import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import prova from '../Factory/FactoryError'

let refreshTokens: any[] = []



dotenv.config()

const acces_schema = yup.object({
    nome_utente: yup.string().required(),
    password: yup.string().required()
    })

const userSchema = yup.object({
    nome_utente: yup.string().required(),
    email: yup.string().required(),
    password: yup.string().required(),
    admin: yup.boolean().optional()
    })

const new_user = async (req:Request, res: Response, next:NextFunction ) => {
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




const getAll = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const ALL = await User.findAll()
        return res.status(StatusCodes.OK).json(ALL)
    }catch(error){
        //return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}

const getById = async(id:number)=>{
    const user = await User.findByPk(id)
    return user
}


const login = async(req: Request, res:Response)=>{
    try{
        acces_schema.validate(req.body).catch(ValidationError=>{
        return res.status(StatusCodes.BAD_REQUEST).json(ValidationError)})
        const valore = acces_schema.validate(req.body)
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

const usContr={
    new_user,
    getAll,
    login,
    getById
}
export default  usContr