import Sequelize from "sequelize"
import { DatabaseSingleton } from "../Singleton/databaseSingleton"
import { INTEGER } from "sequelize";

const sequelize = DatabaseSingleton.getIstanza().getConnessione();

const Model = sequelize.define("models",{
    id:{
        type:Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,

    },
    nome:{
        type: Sequelize.STRING,
        allowNull: false
    },
    datasetid:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    userid:{
        type:INTEGER,
        allowNull: false
    }
})

export default Model