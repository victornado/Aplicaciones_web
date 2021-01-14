"use strict";

const config = require("../config");
const mysql = require("mysql");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const expressSesion = require("express-session");
const expressMySQLSesion = require("express-mysql-session");
const { render } = require("ejs");
const controllerModule = require("../controllers/ReplyController");

const RespuestasR = express.Router();

//ficheros estaticos
const ficherosEstaticos = path.join(__dirname, "../public");
RespuestasR.use(express.static(ficherosEstaticos));

//añadimos el middleware bodyParser
RespuestasR.use(bodyParser.urlencoded({ extended: false }));

// Crear un pool de conexiones a la base de datos de MySQL
const pool = mysql.createPool(config.mysqlConfig);

//crear instacia controller
const controller = new controllerModule();

//obtenemos la clase MySQLStore
const storeSesion = expressMySQLSesion(expressSesion);
const store = new storeSesion(config.mysqlConfig);

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

RespuestasR.get("/voteLikeReply/:idReply/:idQuestion/:nick", AccessControl, controller.likeReply);

RespuestasR.get("/voteDislikeReply/:idReply/:idQuestion/:nick", AccessControl, controller.dislikeReply);

RespuestasR.post("/postReply/:question/:nick", AccessControl, controller.postReply);

module.exports = RespuestasR;