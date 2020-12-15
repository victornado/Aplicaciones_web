"use strict";

const mysql = require("mysql");
const config = require("./config");

// Crear el pool de conexiones
const pool = mysql.createPool({
host: config.host,
user: config.user,
password: config.password,
database: config.database
});

