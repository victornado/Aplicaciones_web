// app.js
const config = require("./config");
const DAOTasks = require("./DAOTasks");
const utils = require("./utils");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

// Crear un servidor Express.js
const app = express();

// Crear un pool de conexiones a la base de datos de MySQL
const pool = mysql.createPool(config.mysqlConfig);

//colocamos ejs como generador de plantillas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//añadimos el middleware bodyParser
app.use(bodyParser.urlencoded({ extended: false }));

// Crear una instancia de DAOTasks
const daoT = new DAOTasks(pool);


app.post("/addTask", function(request, response) {
    let texto = request.body.tarea;
    let task = utils.createTask(texto);
    daoT.insertTask("usuario@ucm.es",task,function(err){
        response.redirect("/tasks");
    })
});

app.get("/tasks", function(request, response) {    
    response.status(200);
    let taskList;
    daoT.getAllTasks("usuario@ucm.es", function(err,content){
        taskList=content;
        response.render("tasks", {taskList});
    }); 
    
});

app.get("/deleteCompleted", function(request, response) {    
    response.status(200);
    daoT.deleteCompleted("usuario@ucm.es", function(err){
        response.redirect("/tasks");
    }); 
});

app.get("/finish/:id", function(request, response) {    
    response.status(200);
    daoT.markTaskDone(request.params.id,function(err){
        response.redirect("/tasks");
    })   
});


const ficherosEstaticos = path.join(__dirname, "public");
app.use(express.static(ficherosEstaticos));

// Arrancar el servidor
app.listen(config.port, function(err) {
   if (err) {
       console.log("ERROR al iniciar el servidor");
   }
   else {
       console.log(`Servidor arrancado en el puerto ${config.port}`);
   }
});