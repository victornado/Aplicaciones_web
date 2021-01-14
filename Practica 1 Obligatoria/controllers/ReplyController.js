"use strict";

const DAOQuestion = require("../models/DAOquestion");
const DAOreply = require("../models/DAOreply");
const DAOuser = require("../models/DaoUser");
const mysql = require("mysql");
const config = require("../config");
const path = require("path");
const expressSesion = require("express-session");
const expressMySQLSesion = require("express-mysql-session");

const pool = mysql.createPool(config.mysqlConfig);

//obtenemos la clase MySQLStore
const storeSesion = expressMySQLSesion(expressSesion);
const store = new storeSesion(config.mysqlConfig);

// Crear una instancia de DAO's
const daoQ = new DAOQuestion(pool);
const daoR = new DAOreply(pool);
const daoU = new DAOuser(pool);

class ReplyController {

    likeReply(request, response) {
        daoR.userVotedReply(request.session.nick, request.params.idReply, function (err, content) {
            if (err) {
                response.status(500);
            }
            else {
                if (!content) {
                    daoR.voteReply(request.session.nick, 1, request.params.idReply, function (err) {
                        if (err) {
                            response.status(500);
                        }
                        else {
                            daoU.modifyRep(request.params.nick, 10, function (err) {
                                if (err) {
                                    response.status(500);
                                }
                                else {
                                    response.redirect("/preguntas/OneQuestion/" + request.params.idQuestion);
                                }
                            })

                        }
                    })
                }
                else {
                    response.redirect("/preguntas/OneQuestion/" + request.params.idQuestion);
                }
            }

        })
    }

    dislikeReply(request, response) {
        daoR.userVotedReply(request.session.nick, request.params.idReply, function (err, content) {
            if (err) {
                response.status(500);
            }
            else {
                if (!content) {
                    daoR.voteReply(request.session.nick, -1, request.params.idReply, function (err) {
                        if (err) {
                            response.status(500);
                        }
                        else {
                            daoU.modifyRep(request.params.nick, -2, function (err) {
                                if (err) {
                                    response.status(500);
                                }
                                else {
                                    response.redirect("/preguntas/OneQuestion/" + request.params.idQuestion);
                                }
                            })
                        }
                    })
                }
                else {
                    response.redirect("/preguntas/OneQuestion/" + request.params.idQuestion);
                }
            }
        })
    }

    postReply(request, response) {
        daoR.createReply(request.params.question, request.body.cuerpo, request.params.nick, function (err) {
            if (err) {
                response.redirect("/404");
            }
            else {
                response.redirect("/preguntas/allQuestions");
            }
        });
    }
}
module.exports = ReplyController;