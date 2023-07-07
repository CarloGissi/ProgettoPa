import express, { NextFunction, Request, Response } from 'express';
import user from './Router/routerUsers';
import dataset from './Router/routerDataset'
import {DatabaseSingleton}  from './Singleton/databaseSingleton';
//import sequelize from './utils/database'

// Constants
//const PORT = 8080;
//const HOST = '0.0.0.0';

// App
const app = express();

app.use(express.json())

app.use(express.urlencoded({extended: true}))

/*app.use((req:Request, res:Response, next:NextFunction)=>{
  //res.set('Acces-Control-Allow-Origin', '*')
  //res.set('Acces-Control-Allow-Origin','GET, POST, PUT, DELETE')
})*/


app.get('/', (req: Request, res: Response) => {
  res.send('Hello World')
});

app.use('/user', user)
app.use('/dataset', dataset);


(async()=>{
  try{
    const sequelize = DatabaseSingleton.getIstanza().getConnessione()

    await sequelize.sync({alter: true})

    app.listen(8080, () => {
      console.log(`Server running on`);
      /*sequelize.authenticate().then(()=>{
        console.log("database connected")
      })*/
    
    });
  }catch(error){

  }
})()