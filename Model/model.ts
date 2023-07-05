import Sequelize from "sequelize"
import { DatabaseSingleton } from "../Singleton/databaseSingleton"
import { INTEGER } from "sequelize";

const sequelize = DatabaseSingleton.getIstanza().getConnessione();

const Model = sequelize.define("model",{
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
    datasetID:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    userID:{
        type:INTEGER,
        allowNull: false
    }
})

export default Model