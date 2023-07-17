"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseSingleton = void 0;
const sequelize_1 = require("sequelize");
class DatabaseSingleton {
    constructor() {
        const nome_db = process.env.PGDATABASE || "";
        const username = process.env.PGUSER || "";
        const password = process.env.PGPASSWORD || "";
        const host = process.env.PGHOST || "";
        this.connessione = new sequelize_1.Sequelize(nome_db, username, password, {
            host: host,
            dialect: 'postgres'
        });
    }
    static getIstanza() {
        if (!DatabaseSingleton.istanza) {
            DatabaseSingleton.istanza = new DatabaseSingleton();
        }
        return DatabaseSingleton.istanza;
    }
    getConnessione() {
        return this.connessione;
    }
}
exports.DatabaseSingleton = DatabaseSingleton;
