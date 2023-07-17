"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routerUsers_1 = __importDefault(require("./Server/Router/routerUsers"));
const routerDataset_1 = __importDefault(require("./Server/Router/routerDataset"));
const routerModel_1 = __importDefault(require("./Server/Router/routerModel"));
const databaseSingleton_1 = require("./Server/Singleton/databaseSingleton");
//import sequelize from './utils/database'
// Constants
//const PORT = 8080;
//const HOST = '0.0.0.0';
// App
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
/*app.use((req:Request, res:Response, next:NextFunction)=>{
  //res.set('Acces-Control-Allow-Origin', '*')
  //res.set('Acces-Control-Allow-Origin','GET, POST, PUT, DELETE')
})*/
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.use('/user', routerUsers_1.default);
app.use('/dataset', routerDataset_1.default);
app.use('/model', routerModel_1.default);
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sequelize = databaseSingleton_1.DatabaseSingleton.getIstanza().getConnessione();
        yield sequelize.sync({ alter: true });
        app.listen(8080, () => {
            console.log(`Server running on`);
            /*sequelize.authenticate().then(()=>{
              console.log("database connected")
            })*/
        });
    }
    catch (error) {
        console.log(error);
    }
}))();
