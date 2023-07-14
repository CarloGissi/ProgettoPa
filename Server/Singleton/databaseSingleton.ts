import {Sequelize} from "sequelize"

export class DatabaseSingleton{
    private static istanza: DatabaseSingleton;
    private connessione: Sequelize;

    private constructor(){
        const nome_db: string = process.env.PGDATABASE || ""
        const username: string = process.env.PGUSER || ""  
        const password: string = process.env.PGPASSWORD || ""
        const host: string = process.env.PGHOST || ""  
        this.connessione = new Sequelize(nome_db, username, password,{
            host: host,
            dialect: 'postgres'
        })
    }

    public static getIstanza(): DatabaseSingleton{
        if(!DatabaseSingleton.istanza){
            DatabaseSingleton.istanza = new DatabaseSingleton();
        }
        return DatabaseSingleton.istanza;
    }

    public getConnessione(){
        return this.connessione;
    }
}

