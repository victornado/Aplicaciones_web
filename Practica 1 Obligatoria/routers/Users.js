"use strict";

const config = require("../config");

const path = require("path");
const mysql = require("mysql");
const multer = require("multer");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const expressSesion = require("express-session");
const expressMySQLSesion = require("express-mysql-session");
const { render } = require("ejs");
const controllerModule = require("../controllers/UserController");

//factoria de multer 
const multerFactory = multer({ dest: path.join(__dirname, "../profile_imgs") });

const usuariosR = express.Router();
// Crear un pool de conexiones a la base de datos de MySQL
const pool = mysql.createPool(config.mysqlConfig);

//añadimos el middleware bodyParser
usuariosR.use(bodyParser.urlencoded({ extended: false }));

//ficheros estaticos
const ficherosEstaticos = path.join(__dirname, "../public");
usuariosR.use(express.static(ficherosEstaticos));


//crear instacia controller
const controller = new controllerModule();

//obtenemos la clase MySQLStore
const storeSesion = expressMySQLSesion(expressSesion);
const store = new storeSesion(config.mysqlConfig);

function AccessControl(request, response, next) {
    if (request.session.currentUser == null) {
        response.redirect("usuarios/login");
    }
    else {
        response.locals.userEmail = request.session.currentUser;
        response.locals.icon = request.session.icon;
        response.locals.nick = request.session.nick;
        response.locals.date = request.session.date;
        next();
    }
}

//register usuario

usuariosR.get("/register", controller.register);

usuariosR.post("/registerForm", multerFactory.single("img"), controller.registerForm);

//loggin usuario

usuariosR.get("/login", controller.login);

usuariosR.post("/loginForm", controller.loginForm);

usuariosR.get("/logout", controller.logout);

//resto

usuariosR.get("/profile", AccessControl, controller.profile);

usuariosR.get("/profile/:nick", AccessControl, controller.profileUsers);

usuariosR.get("/allUsers", AccessControl, controller.allUsers);

usuariosR.post("/UserFilter", AccessControl, controller.userFilter);

usuariosR.get("/imgLogUser", AccessControl, controller.getUserIMG);

module.exports = usuariosR;