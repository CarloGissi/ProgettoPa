import Sequelize from "sequelize"
import { DatabaseSingleton } from "../Singleton/databaseSingleton"
import { INTEGER } from "sequelize";

const sequelize = DatabaseSingleton.getIstanza().getConnessione();

const Dataset = sequelize.define("datasets",{
    deletedAt:{
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
    },
    id:{
        type:Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
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
    uid:{
        type:INTEGER,
        allowNull: false
    },
}, {
    paranoid:true
})

export default Dataset