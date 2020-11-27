"use strict";

const mysql = require("mysql");
const config = require("./config");
const DAOUsers = require("./DAOUsers");
const DAOTasks = require("./DAOTasks");

// Crear el pool de conexiones
const pool = mysql.createPool({
host: config.host,
user: config.user,
password: config.password,
database: config.database
});

let daoUser = new DAOUsers(pool);
let daoTask = new DAOTasks(pool);

let myTask ={ text: "Preparar práctica AW",done:0, tags: ["AW" , "practica"] };
daoTask.insertTask("nose@nada.es",myTask,a);
function a(err,content){
    console.log(content);
}
// Definición de las funciones callback
// Uso de los métodos de las clases DAOUsers y DAOTasks