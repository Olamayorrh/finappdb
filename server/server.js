const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();


//  so you need to create a file in your root folder called .env and and the secrets 


const dbName = process.env.DB_NAME || "";
const dbUser = process.env.DB_USER || "";
const dbPassword = process.env.DB_PASS || "";
const dbHost = process.env.DB_HOST || "";
const dbPort = parseInt(process.env.DB_PORT ?? "3306");

const connection = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: "mysql",
  logging: false,
  dialectOptions: {
    connectTimeout: 60000,
  },
});

module.exports = {connection}