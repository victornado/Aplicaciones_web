"use strict";

const config = require("../config");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const expressSesion = require("express-session");
const expressMySQLSesion = require("express-mysql-session");
const { render } = require("ejs");
const controllerModule = require("../controllers/QuestionController");
const PreguntasR = express.Router();

// Crear un pool de conexiones a la base de datos de MySQL
const pool = mysql.createPool(config.mysqlConfig);

//añadimos el middleware bodyParser
PreguntasR.use(bodyParser.urlencoded({ extended: false }));

//ficheros estaticos
const ficherosEstaticos = path.join(__dirname, "../public");
PreguntasR.use(express.static(ficherosEstaticos));

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

//get y post

PreguntasR.get("/AllQuestions", AccessControl, controller.getAllQuestion);

PreguntasR.get("/imagenUsuarios/:icon", AccessControl, controller.getIcon);

PreguntasR.get("/sinRespuesta", AccessControl, controller.QuestionsWithoutReply);

PreguntasR.get("/SBTag/:tag", AccessControl, controller.SearchByTag);

PreguntasR.post("/SBText", AccessControl, controller.searchByText);

PreguntasR.get("/OneQuestion/:id", AccessControl, controller.OneQuestion);

PreguntasR.get("/createQuestion", AccessControl, controller.createQuestion);

PreguntasR.post("/createQuestionForm", AccessControl, controller.createQuestionForm);

PreguntasR.get("/voteLikeQuestion/:id/:nick", AccessControl, controller.likeQuestion);

PreguntasR.get("/voteDislikeQuestion/:id/:nick", AccessControl, controller.dislikeQuestion);

module.exports = PreguntasR;