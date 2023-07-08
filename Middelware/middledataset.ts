import jwt from 'jsonwebtoken'
import {Request, Response, NextFunction} from 'express'
import {StatusCodes} from 'http-status-codes'
import allVariable from '../Controller/controllerDataset'

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
    const datasetID = (req as any).query.id
    try {
        const dataset = await allVariable.getById(parseInt(datasetID))
        if (!dataset) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Dataset non trovato.' })
        }
        const userID = (req as any).body.uid
        if ((dataset as any).uid == userID) {
            next()
        } else {
            res.status(StatusCodes.FORBIDDEN).json({
                message: 'Non sei il proprietario del dataset.'
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