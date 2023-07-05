import {Sequelize} from "sequelize"

export class DatabaseSingleton{
    private static istanza: DatabaseSingleton;
    private connessione: Sequelize;

    private constructor(){
        const nome_db: string = process.env.PGDATABASE || "admin"
        const username: string = process.env.PGUSER || "carlo"  
        const password: string = process.env.PGPASSWORD || "Carlo"
        const host: string = process.env.PGHOST || "localhost"  
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

