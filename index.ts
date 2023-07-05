import express, { Request, Response } from 'express';
import users from './router/routerUsers';
import {DatabaseSingleton}  from './Singleton/databaseSingleton';
//import sequelize from './utils/database'

// Constants
//const PORT = 8080;
//const HOST = '0.0.0.0';

// App
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/user',users)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World')
});
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