"use strict";
const DAOuser = require("../models/DaoUser");
const mysql = require("mysql");
const config = require("../config");
const expressSesion = require("express-session");
const expressMySQLSesion = require("express-mysql-session");
const path = require("path");

const pool = mysql.createPool(config.mysqlConfig);

//obtenemos la clase MySQLStore
const storeSesion = expressMySQLSesion(expressSesion);
const store = new storeSesion(config.mysqlConfig);

// Crear una instancia de DAO's
const daoU = new DAOuser(pool);

class UserController {


    register(request, response) {
        let errorMsg = null;
        response.render("register", { errorMsg });
    }

    registerForm(request, response) {
        response.status(200);
        let errorMsg = null;
        let nombreFichero = "";
        let aleatorio = Math.round(Math.random() * 10);
        nombreFichero = aleatorio + ".png"; //seleccionamos una imagen aleatoria de 11 
        if (request.file) { // si el usuario a elegido una imagen la aleatoria se sobreescribe
            nombreFichero = request.file.filename;
        }

        if (request.body.pass == request.body.pass2) {
            daoU.insertNewMember(request.body.user, request.body.pass, request.body.nick, nombreFichero, function (err, content) {
                if (err) {
                    response.render("register", { errorMsg: 1 }); //algo ha fallado en el insert
                }
                else {
                    response.render("register", { errorMsg: 2 }); //todo ok
                }
            })
        }
        else {
            response.render("register", { errorMsg: 3 });
        }
    }

    login(request, response) {
        let errorMsg = null;
        response.render("login", { errorMsg });
    }

    loginForm(request, response) {
        response.status(200);
        let errorMsg = 1;
        daoU.isUserCorrect(request.body.user, request.body.pass, function (err, content) {
            if (err) {
                response.status(500);
                response.render("login", { errorMsg: "error interno en la base de datos" });
            }
            else {
                if (content) {//existe el usuario
                    daoU.getMinInfoByEmail(request.body.user, function (err, content) {
                        if (err) {
                            response.status(500);
                        }
                        else {
                            request.session.nick = content.nick;
                            request.session.icon = content.icon;
                            request.session.date = content.date;
                            request.session.currentUser = request.body.user;
                            response.redirect("/index");
                        }
                    });
                }
                else {
                    response.status(200);
                    response.render("login", { errorMsg: "Credenciales incorrectas" });
                }

            }
        })
    }

    logout(request, response) {
        // currentUser=null;
        let errorMsg = null;
        request.session.destroy();
        response.render("login", { errorMsg });
    }

    profile(request, response) {
        let userInfo = null;
        daoU.getUserProfile(request.session.nick, function (err, content) {
            if (err) {
                response.status(500);
            }
            else {
                response.status(200);
                userInfo = content;
                response.render("profile", { userInfo });
            }
        });
    }

    profileUsers(request, response) {
        let userInfo = null;
        daoU.getUserProfile(request.params.nick, function (err, content) {
            if (err) {
                response.status(500);
            }
            else {
                response.status(200);
                userInfo = content;

                response.render("profile", { userInfo });
            }
        });
    }

    allUsers(request, response) {
        let userslist = null;
        daoU.getAllUsers(function (err, content) {
            if (err) {
                response.status(500);
            }
            else {
                response.status(200);
                userslist = content;
                let i=0;
                userslist.forEach(user => {
                    daoU.getMVPTag(user.nick , function(err, daotag){
                        if(err)
                        {
                            response.status(500);
                        }
                        else
                        {
                            response.status(200);
                            user.tag=daotag;
                        }
                        i++;
                    })
                });
                if(i==userslist.length)
                    response.render("allUsers", { userslist });
            }
        });
    }

    userFilter(request, response) {
        if (request.body.userF != "") {
            daoU.searchByTextBar(request.body.userF, function (err, content) {
                if (err) {
                    response.status(500);
                }
                else {
                    response.status(200);
                    let userslist = content;
                    response.render("SearchUser", { userslist });
                }

            });
        }
    }

    getUserIMG(request, response) {
        daoU.getUserImageName(request.session.currentUser, function (err, content) {
            if (err) {
                response.status(500);

            }
            else {
                response.status(200);
                if (content == "") {
                    let ruta = path.join(__dirname, "../profile_imgs");
                    ruta = path.join(ruta, "NoPerfil.jpg");
                    response.sendFile(ruta);
                }
                else {
                    let ruta = path.join(__dirname, "../profile_imgs");
                    ruta = path.join(ruta, content);
                    response.sendFile(ruta);
                }
            }
        });
    }

}
module.exports = UserController;