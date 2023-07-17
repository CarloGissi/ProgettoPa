"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const databaseSingleton_1 = require("../Singleton/databaseSingleton");
const sequelize = databaseSingleton_1.DatabaseSingleton.getIstanza().getConnessione();
const User = sequelize.define("users", {
    id: {
        type: sequelize_1.default.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nome_utente: {
        type: sequelize_1.default.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: sequelize_1.default.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: sequelize_1.default.STRING,
        allowNull: false
    },
    admin: {
        type: sequelize_1.default.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    credito: {
        type: sequelize_1.default.FLOAT,
        allowNull: false,
        defaultValue: process.env.CREDITS || 10
    }
});
exports.default = User;
