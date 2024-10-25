const {Sequelize} = require('sequelize');
const environment = 'development';
const config = require('../config/database');
const dbConfig = config[environment];

/**
 * Create DB connection
 *
 * @type {Sequelize}
 */
const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        port: dbConfig.port
    }
);

module.exports = {
    sequelize
};
