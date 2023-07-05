import Sequelize from "sequelize"
import { DatabaseSingleton } from "../Singleton/databaseSingleton"
import { INTEGER } from "sequelize";

const sequelize = DatabaseSingleton.getIstanza().getConnessione();

const Dataset = sequelize.define("dataset",{
    id:{
        type:Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,

    },
    nome:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    tags:{
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'hello'
    },
    userID:{
        type:INTEGER,
        allowNull: false
    }
})

export default Dataset