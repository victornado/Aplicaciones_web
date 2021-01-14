"use strict";


const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const config = require("./config");
const expressSesion = require("express-session");
const expressMySQLSesion = require("express-mysql-session");
const { render } = require("ejs");
const mysql = require("mysql");

// Crear un servidor Express.js
const app = express();

//colocamos ejs como generador de plantillas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//añadimos el middleware bodyParser
app.use(bodyParser.urlencoded({ extended: false }));

//ficheros estaticos
const ficherosEstaticos = path.join(__dirname, "public");
app.use(express.static(ficherosEstaticos));

//--------------------------------------------------------Login-Logout

const pool = mysql.createPool(config.mysqlConfig);

//obtenemos la clase MySQLStore
const storeSesion = expressMySQLSesion(expressSesion);
const store = new storeSesion(config.mysqlConfig);

//middleware express-session
const middlewareSession = expressSesion({
    saveUninitialized: false,
    secret: "foobar34",
    resave: false,
    store: store
});
app.use(middlewareSession);

function AccessControl(request, response, next) {
    if (request.session.currentUser == null) {
        response.redirect("/usuarios/login");
    }
    else {
        response.locals.userEmail = request.session.currentUser;
        response.locals.icon = request.session.icon;
        response.locals.nick = request.session.nick;
        response.locals.date = request.session.date;
        next();
    }
}

//routers
const usuariosR = require("./routers/Users");
app.use("/usuarios", usuariosR);

const preguntasR = require("./routers/Questions");
app.use("/preguntas", preguntasR);

const respuestasR = require("./routers/Reply");
app.use("/respuestas", respuestasR);

app.get("/index",AccessControl, function (request, response) {
    response.status(200);
    let user=request.session.nick;
    response.render("index",{user});
});

// Arrancar el servidor
app.listen(config.port, function (err) {
    if (err) {
        console.log("ERROR al iniciar el servidor");
    }
    else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
});

//update los votos (preguntas y respuestas)
//imagen al registrarse??
//usuario tag
//routers?