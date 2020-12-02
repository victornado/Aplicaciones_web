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

let myTask ={ text: "Preparar práctica AW",done:false, tags: ["AW" , "practica"] };

//daoTask.insertTask("hola@nada.es",myTask,a);
//daoTask.getAllTasks("hola@nada.es",a);
//daoTask.markTaskDone(31,b);
//daoTask.deleteCompleted("asd",b)
//daoUser.isUserCorrect("hola@nada.es","12345",a);
//daoUser.getUserImageName("hola@nada.es",a);

function a(err,content){
    if (err)
        console.log(err);
    else
        console.log(content);
}
function b(err){
    if(err!=null)
        console.log(err);
    else 
        console.log("HECHO");
}
// Definición de las funciones callback
// Uso de los métodos de las clases DAOUsers y DAOTasks