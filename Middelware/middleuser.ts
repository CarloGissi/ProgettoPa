import jwt from 'jsonwebtoken'
import {Request, Response, NextFunction} from 'express'
import controllerUser from '../Controller/controllerUser'
import {StatusCodes} from 'http-status-codes'

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



const controllo_admin = async (request: Request, response: Response, next: NextFunction) => {
    const USER = await controllerUser.getById(parseInt((request as any).query.id))
    if (USER?.get("admin") === true) {
        next()
    } else {
        response.status(StatusCodes.UNAUTHORIZED).send("Unauthorized")
    }
}

const middlex = {
    controllo_token,
    controllo_admin
}
export default middlex