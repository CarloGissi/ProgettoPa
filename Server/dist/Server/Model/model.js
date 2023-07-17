"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const databaseSingleton_1 = require("../Singleton/databaseSingleton");
const sequelize_2 = require("sequelize");
const sequelize = databaseSingleton_1.DatabaseSingleton.getIstanza().getConnessione();
const Model = sequelize.define("models", {
    id: {
        type: sequelize_1.default.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    nome: {
        type: sequelize_1.default.STRING,
        allowNull: false
    },
    datasetid: {
        type: sequelize_1.default.INTEGER,
        allowNull: false,
        unique: true
    },
    userid: {
        type: sequelize_2.INTEGER,
        allowNull: false
    }
});
exports.default = Model;
