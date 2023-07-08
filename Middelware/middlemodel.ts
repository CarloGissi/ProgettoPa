import jwt from 'jsonwebtoken'
import {Request, Response, NextFunction} from 'express'
import {StatusCodes} from 'http-status-codes'
import allVariable from '../Controller/controllerModel'

const controllo_token = async (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null){
        return res.sendStatus(401);
    }else{
        jwt.verify(token, process.env.KEY as string || "ciao", (err: any) => {
        if (err){
            return res.sendStatus(403);  
        }else{
            next();
        } 
        });
    }  
  }

const isProprietario = async (req: Request, res: Response, next: NextFunction) => {
    const modelloID = (req as any).query.id
    try {
        const modello = await allVariable.getById(parseInt(modelloID))
        if (!modello) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Modello non trovato.' })
        }
        const userID = (req as any).body.uid
        if ((modello as any).userID == userID) {
            next()
        } else {
            res.status(StatusCodes.FORBIDDEN).json({
                message: 'Non sei il proprietario del modello.'
            })
        }
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: error })
    }
}

const middlex = {
    controllo_token,
    isProprietario
}
export default middlex