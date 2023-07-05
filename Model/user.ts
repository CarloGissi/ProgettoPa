import Sequelize from "sequelize"
import { DatabaseSingleton } from "../Singleton/databaseSingleton"

const sequelize = DatabaseSingleton.getIstanza().getConnessione();

const User = sequelize.define("users",{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nome_utente:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false
    },
    admin:{
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    credito:{
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: process.env.CREDITS || 1000
    }
})

export default User