import { Response, Request, NextFunction, response } from "express";
import Dataset  from "../Model/dataset";
import { StatusCodes } from "http-status-codes";
import * as yup from 'yup'
import multer, {MulterError} from 'multer'
import controllerUser from './controllerUser'
import * as fs from 'fs'
import ffmpeg from 'fluent-ffmpeg'
import { ffprobe } from "fluent-ffmpeg";

//creazione dello schema per leggere il dataset dal json
const schemaDataset = yup.object({
    nome: yup.string().required(),
    tags: yup.string().required(),
    uid: yup.number().typeError('Devi inserire un numero').required()    
})

//creazione dello schema per poter leggere i dati da un json
const aggSchemaDataset = yup.object({
    nome: yup.string().optional(),
    tags: yup.string().optional()  
})

//funzione che ritorno tutti i datasets dello stesso utente
const getAll = async (req:Request, res: Response, next:NextFunction ) => {
    try{
        const all = await Dataset.findAll() //{where: {uid: req.query.uid}}//{paranoid:false} per mostrare i record eliminati logicamente
        return res.json(all) 
    }catch(error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }  
}

//funzione per creare un nuovo dataset
const newDataset = async (req:Request, res: Response, next:NextFunction ) => {
    try{
        //se lo schema non è rispettato parte l'eccezione della validazione
        if (!req.body || Object.keys(req.body).length === 0 || Object.keys(req.body).length === 1 || Object.keys(req.body).length === 2) {
            return res.status(400).json({ error: 'Il body della richiesta è vuoto.' })}
        //creiamo una variabile per poter riprendere i valori della validazione
        const valore = schemaDataset.validate(req.body)
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


//funzione per aggioranre un ndataset in base all'id
const aggiornaDataset = async(req: Request, res:Response)=>{
    try{
        const presente = await Dataset.findOne({where: {id: req.query.id}})
        if(presente){
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ error: 'Il body della richiesta è vuoto.' })}
                else{
                    const valore = aggSchemaDataset.validate(req.body)
                    const modello_dataset = {
                        nome: (await valore).nome,
                        tags : (await valore).tags
                }
                const dataset_agg = await Dataset.update(modello_dataset, {where: {id: req.query.id}})
                return res.status(StatusCodes.OK).json('Dataset aggiornato')
                }
        }else{
            return res.status(StatusCodes.NOT_FOUND).json('Dataset non presente')
        }

    }catch(error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)

    }
}

//funzione che ritorna un dataset in base all'id passato
const getById = async(id:number)=>{
    const dataset = await Dataset.findByPk(id)
    return dataset
}

//funzione che elimina un dataset in base all'id passato
const eliminaDatasetById = async (req:Request, res: Response, next:NextFunction ) => {
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

const verificaCredito = async(id: number, numeroFile: number)=>{
    const user = await controllerUser.getById(id) as any
    const credito = user?.getDataValue('credito');
    if(credito > 0.05 * numeroFile){
        return true
    }else{
        return false
    }
}

function convertTimestampToString(timestamp: number): string {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    return formattedDate;
  }

  const rimuvoiCredito = async(id: number, numeroFile: number)=>{
    const user = await controllerUser.getById(id) as any
    const credito_residuo = user?.getDataValue('credito');
    const costo = 0.05*numeroFile
    const nuovo_credito = credito_residuo-costo
    await user.update({credito: nuovo_credito})
}
  


const caricaImmagine = async (req:Request, res:Response) => {
    try{
        //creiamo la cartella se non esiste
        const cartella_dataset = './data/images/img_'+`${req.params.uid}`+'_'+`${req.query.id}`+'/'
        if(!fs.existsSync(cartella_dataset)){
            await fs.mkdir(cartella_dataset, {recursive:true}, err =>{
            if(err){
                return res.status(StatusCodes.NOT_FOUND).json(err)
                }
            })
        }
        //verifichiamo il credito dell'utente che ha effettuato l'accesso ed è proprietario del dataset
        if(await verificaCredito((req.params as any).uid, 1)){
            const storageEngine = multer.diskStorage({
                destination:(req, file, callback)=>{
                    callback(null, cartella_dataset)
                },
                filename:(req, file, callback)=>{
                    const timestamp = Date.now()
                    const filename = 'tmp_' + `${convertTimestampToString(timestamp)}`+ '_' + file.originalname
                    callback(null, filename)
                },
            });

        const caricamento = multer({
            storage:storageEngine,
            fileFilter: (req, file, callback)=>{
            if (file.mimetype.startsWith('image/')){
                callback(null,true);
            }else{
                callback(new Error('Non ci sono immagini'))
            }  
            }
        })
        //controlliamo che l'immagine sia stata caricata
        caricamento.single('immagine')(req, res, async(err: any)=>{
            if(err instanceof MulterError){
                return res.status(StatusCodes.BAD_REQUEST).json(err)
            }else if (err){
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
            }
            if(!(req.file instanceof Array) && !req.file){
                return res.status(StatusCodes.BAD_REQUEST).json(err)
            }else{
                rimuvoiCredito((req.params as any).uid,1)
                return res.status(StatusCodes.OK).json('il file è stato caricato')}
            
        })
    }else{
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Credito insufficiente"})
    }
    }catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
};


const caricaVideo = async (req:Request, res:Response) => {
    try{
        //creiamo la cartella se non esiste
        const cartella_dataset = './data/video/v_'+`${req.params.uid}`+'_'+`${req.query.id}`+'/'
        if(!fs.existsSync(cartella_dataset)){
            await fs.mkdir(cartella_dataset, {recursive:true}, err =>{
            if(err){
                return res.status(StatusCodes.NOT_FOUND).json(err)
            }
        })
    }

        
        //verifichiamo il credito dell'utente che ha effettuato l'accesso ed è proprietario del dataset
        if(await verificaCredito((req.params as any).uid, 20)){
            const storageEngine = multer.diskStorage({
                destination:(req, file, callback)=>{
                    callback(null, cartella_dataset)
                },
                filename:(req, file, callback)=>{
                    const timestamp = Date.now()
                    const filename = 'tmp_' + `${convertTimestampToString(timestamp)}`+ '_' + file.originalname
                    req.params.filename = filename
                    callback(null, filename)
                },
            });

            const caricamento = multer({
                storage:storageEngine,
                fileFilter: (req, file, callback)=>{
                if (file.mimetype.startsWith('video/mp4')){
                    callback(null,true);
                }else{
                    callback(new Error('Non ci sono video mp4'))
                }  
                }
            })
        //controlliamo che il video sia stato caricato
            caricamento.single('video')(req, res, async(err: any)=>{
                if(err instanceof MulterError){
                    return res.status(StatusCodes.BAD_REQUEST).json(err)
                }else if (err){
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
                }
                if(!(req.file instanceof Array) && !req.file){
                    return res.status(StatusCodes.BAD_REQUEST).json(err)
                }else{
                    //creiamo se non esiste la cartella dove saranno contenuti i frame
                    const cartella_frame = cartella_dataset + '/'+'frame/'+req.params.filename.slice(0,-4)
                    if(!fs.existsSync(cartella_frame)){
                        await fs.mkdir(cartella_frame, {recursive:true}, err =>{
                            if(err){
                                return res.status(StatusCodes.NOT_FOUND).json(err)
                            }
                        })
                    }
                    const video_path = cartella_dataset+req.params.filename
                    //prendiamo i frame con la libreria 
                    await ffmpeg(video_path)
                    .on('filenames', (filenames)=>{
                        console.log('I frame vengono estratti')
                    })
                    .on('end',()=>{
                        console.log('Estrazione completata')
                    })
                    .screenshots({
                        count: 20,
                        filename: 'frame-%i.png',
                        folder: cartella_frame
                    })
                    //rimuoviamo i crediti in base ai frame che abbiamo
                    rimuvoiCredito((req.params as any).uid,20)
                    return res.status(StatusCodes.OK).json("Il file è stato caricato");

                }
                
            })
    }else{
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Credito insufficiente"})
    }
    }catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
};






//per esportazione
const allVariable={
    getAll,
    newDataset,
    eliminaDatasetById,
    aggiornaDataset,
    getById,
    caricaImmagine,
    caricaVideo
}

export default allVariable