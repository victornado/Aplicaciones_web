// app.js
const config = require("./config");
const DAOTasks = require("./DAOTasks");
const DAOUsers = require("./DAOUsers");
const utils = require("./utils");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const expressSesion = require ( "express-session");
const expressMySQLSesion = require ( "express-mysql-session");
const { render } = require("ejs");

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
const daoU = new DAOUsers(pool);

//middleware static
const ficherosEstaticos = path.join(__dirname, "public");
app.use(express.static(ficherosEstaticos));

//obtenemos la clase MySQLStore
const storeSesion =  expressMySQLSesion(expressSesion);
const store= new storeSesion(config.mysqlConfig);

//middleware express-session
const middlewareSession = expressSesion({
    saveUninitialized: false,
    secret: "foobar34",             
    resave: false,
    store: store
});
app.use(middlewareSession);

//middleware de control de acceso
function AccessControl(request, response, next){
    if(request.session.currentUser==null){
        response.redirect("/login");
    }
    else{
        response.locals.userEmail = request.session.currentUser;
        next();
    }
}

app.get("/imagenUsuario", function(request, response){
    daoU.getUserImageName(request.session.currentUser,function(err,content){
        if(err){
            response.status(500);
            
        }
        else{
            if(content==null) 
            {
                let ruta = path.join(__dirname, "profile_imgs");
                ruta = path.join(ruta, "NoPerfil.jpg");
                response.sendFile(ruta);
            }
            else{
                let ruta = path.join(__dirname, "profile_imgs");
                ruta = path.join(ruta, content);
                response.sendFile(ruta);
            }
        }
    });
});

app.post("/addTask", AccessControl, function(request, response) {
    let texto = request.body.tarea;
    let task = utils.createTask(texto);
    daoT.insertTask(request.session.currentUser,task,function(err){
        response.redirect("/tasks");
    })
});

app.get("/tasks",AccessControl, function(request, response) {    
    response.status(200);
    let taskList;
    daoT.getAllTasks(request.session.currentUser, function(err,content){
        taskList=content;
        
        response.render("tasks", {taskList});
    }); 
});

app.get("/deleteCompleted", AccessControl, function(request, response) {    
    response.status(200);
    daoT.deleteCompleted(request.session.currentUser, function(err){
        response.redirect("/tasks");
    }); 
});

app.get("/finish/:id", AccessControl, function(request, response) {    
    response.status(200);
    daoT.markTaskDone(request.params.id,function(err){
        response.redirect("/tasks");
    })   
});

app.get("/login", function(request, response) {
 let errorMsg=null;
 response.render("login" , {errorMsg});
});

app.post("/login", function(request, response) {
    response.status(200);
    let errorMsg=1;
    daoU.isUserCorrect(request.body.correo, request.body.pass,function(err,content){
        if(err){
            response.status(500);
            response.render("login" , {errorMsg:"error interno en la base de datos"});
        }
        else {
            if(content){//existe el usuario
                
                request.session.currentUser = request.body.correo;
                response.redirect("/tasks");
            }
            else {
                response.status(200);
                response.render("login" , {errorMsg:"Credenciales incorrectas"});
            }
                
        }
    })
});
app.get("/logout", function(request, response) {
    // currentUser=null;
    let errorMsg=null;
    request.session.destroy();
    response.render("login" , {errorMsg});
});

// Arrancar el servidor
app.listen(config.port, function(err) {
   if (err) {
       console.log("ERROR al iniciar el servidor");
   }
   else {
       console.log(`Servidor arrancado en el puerto ${config.port}`);
   }
});

/*
añadir middleware sesion y vamos empezando la pagina 3 primer parrafo
*/ 