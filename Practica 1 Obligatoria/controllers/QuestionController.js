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

class QuestionController {

    getAllQuestion(request, response) {
        let questList = null;
        daoQ.getAllQuestions(function (err, content) {
            if (err) {
                response.status(500);
            }
            else {
                response.status(200);
                questList = content;
                response.render("AllQuestions", { questList });
            }
        });
    }

    getIcon(request, response) {
        let nombre;
        if (request.params.icon == null || request.params.icon == '' || request.params.icon == "") {
            nombre = "NoPerfil.jpg";
        }
        else {
            nombre = request.params.icon;
        }
        let ruta = path.join(__dirname, "../profile_imgs");
        ruta = path.join(ruta, nombre);
        response.sendFile(ruta);
    }

    QuestionsWithoutReply(request, response) {
        let questList = null;
        daoQ.getQuestionWithoutReply(function (err, content) {
            if (err) {
                response.status(500);
            }
            else {
                response.status(200);
                questList = content;
                response.render("QuestWithoutReply", { questList });
            }
        });

    }

    SearchByTag(request, response) {
        let questList = null;
        daoQ.searchByTag(request.params.tag, function (err, content) {
            if (err) {
                response.status(500);
            }
            else {
                response.status(200);
                questList = content;
                questList.filter = request.params.tag;
                response.render("SearchByTag", { questList });
            }
        });
    }

    searchByText(request, response) {
        if (request.body.textForm != "") {
            daoQ.searchByTextBar(request.body.textForm, function (err, content) {
                if (err) {
                    response.status(500);
                }
                else {
                    response.status(200);
                    let questList = content;
                    response.render("SearchByText", { questList });
                }
            });
        }
    }

    OneQuestion(request, response) {
        let info = {
            nvisits: 0,
            question: "",
            voteq: "",
            replys: ""
        };
        daoQ.getQuestion(request.params.id, function (err, content) { //coge la pregunta en si
            if (err) {
                response.status(500);
            }
            else {
                info.question = content[0];

                daoQ.getVotes(request.params.id, function (err, content) {
                    if (err) {
                        response.status(500);
                    }
                    else {
                        info.voteq = content;
                        daoR.getAllReplys(info.question.id, function (err, content) { //usando el id busca todas las respuestas a esa pregunta
                            if (err) {
                                response.status(500);
                            }
                            else {
                                info.replys = content;
                                daoQ.doAVisit(request.session.nick, info.question.id, function (err) {
                                    daoQ.getNumVisits(info.question.id, function (err, content) { //contabiliza la visita
                                        if (err) {
                                            response.status(500);
                                        }
                                        else {
                                            info.nvisits = content;
                                            response.render("OneQuestion", { info }); //renderiza la pregunta con sus respuestas
                                        }
                                    });
                                });
                            }
                        });
                    }
                })
            }
        });
    }

    createQuestion(request, response) {
        let errorMsg = null;
        response.render("createQuestion", { errorMsg });
    }

    createQuestionForm(request, response) {
        let q = {
            nick: request.session.nick,
            title: request.body.titulo,
            text: "",
            tags: []
        };
        let textoBruto = request.body.cuerpo.split(" ");
        q.tags = textoBruto.filter(v => v.startsWith("@") == true);
        q.tags = q.tags.map(v => v.substr(1));
        q.text = textoBruto.filter(v => v.startsWith("@") == false).join(" ");

        daoQ.createQuestion(q, function (err) {
            if (err) {
                let errorMsg = "El titulo ya existe";
                response.render("createQuestion", { errorMsg });
            }
            else {
                response.redirect("/preguntas/AllQuestions");
            }
        });
    }

    likeQuestion(request, response) {
        daoQ.userVotedQuestion(request.session.nick, request.params.id, function (err, content) {
            if (err) {
                response.status(500);
            }
            else {
                if (!content) {
                    daoQ.voteQuestion(request.session.nick, 1, request.params.id, function (err) {
                        if (err) {
                            response.status(500);
                        }
                        else {
                            daoU.modifyRep(request.params.nick, 10, function (err) {
                                if (err) {
                                    response.status(500);
                                }
                                else {
                                    response.redirect("/preguntas/OneQuestion/" + request.params.id);
                                }
                            })

                        }
                    })
                }
                else {
                    response.redirect("/preguntas/OneQuestion/" + request.params.id);
                }

            }
        })
    }

    dislikeQuestion(request, response) {
        daoQ.userVotedQuestion(request.session.nick, request.params.id, function (err, content) {
            if (err) {
                response.status(500);
            }
            else {
                if (!content) {
                    daoQ.voteQuestion(request.session.nick, -1, request.params.id, function (err) {
                        if (err) {
                            response.status(500);
                        }
                        else {
                            daoU.modifyRep(request.params.nick, -2, function (err) {
                                if (err) {
                                    response.status(500);
                                }
                                else {
                                    response.redirect("/preguntas/OneQuestion/" + request.params.id);
                                }
                            })
                        }
                    })
                }
                else {
                    response.redirect("/preguntas/OneQuestion/" + request.params.id);
                }
            }
        })
    }
}
module.exports = QuestionController;