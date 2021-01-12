"use strict";

const config = require("./config");
const DAOquestion = require("./DAOquestion");
const DAOuser = require("./DaoUser");
const DAOreply =require("./DAOreply");
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

//ficheros estaticos
const ficherosEstaticos = path.join(__dirname, "public");
app.use(express.static(ficherosEstaticos));

// Crear una instancia de DAO's
const daoQ = new DAOquestion(pool);//funciona 100%
const daoU = new DAOuser(pool); //funciona 100%
const daoR = new DAOreply(pool);

//--------------------------------------------------------Login-Logout
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
        response.locals.icon = request.session.icon;
        response.locals.nick = request.session.nick;
        response.locals.date = request.session.date;
        next();
    }
}
app.get("/login", function(request, response) {
    let errorMsg=null;
    response.render("login" , {errorMsg});
});
   
app.post("/loginForm", function(request, response) {
    response.status(200);
    let errorMsg=1;
    daoU.isUserCorrect(request.body.user, request.body.pass, function(err,content){
        if(err){
            response.status(500);
            response.render("login" , {errorMsg:"error interno en la base de datos"});
        }
        else {
            if(content){//existe el usuario
                daoU.getMinInfoByEmail(request.body.user,function(err,content){
                    if(err){
                        response.status(500);
                    }
                    else{
                        request.session.nick=content.nick;
                        request.session.icon=content.icon;
                        request.session.date=content.date;
                        request.session.currentUser = request.body.user;
                        response.redirect("/AllQuestions");        
                    }
                }); 
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

//----------------------------------------------------------Fin Login-Logout

//----------------------------------------------------------Register

app.get("/register", function(request, response) {
    let errorMsg=null;
    response.render("register" , {errorMsg});
});

app.post("/registerForm", function(request, response) {
    response.status(200);
    let errorMsg=null;
    daoU.insertNewMember(request.body.user, request.body.pass, request.body.nick, request.body.img, function(err,content){
        if(err){
             response.render("register" , {errorMsg:1}); //algo ha fallado en el insert
        }
        else {
            response.render("register" , {errorMsg:2}) //todo ok
        }
    })
});
//---------------------------------------------------------- fin Register

//---------------------------------------------------------- 404 - Posts
app.get("/AllQuestions",AccessControl, function(request, response) {
    let questList=null;
    daoQ.getAllQuestions(function(err, content){
        if(err){
            response.status(500);
        }
        else{
            response.status(200);
            questList=content;
            response.render("AllQuestions" , {questList});
        }
    });
    
}); 

app.get("/imagenUsuarios/:icon",AccessControl, function(request, response){
    let nombre;
    if(request.params.icon==null || request.params.icon=='' || request.params.icon==""){
        nombre="NoPerfil.jpg";
    }
    else{
        nombre = request.params.icon;
    }
    let ruta = path.join(__dirname, "profile_imgs");
    ruta = path.join(ruta, nombre);
    response.sendFile(ruta);
});

app.get("/imgLogUser",AccessControl, function(request, response){
    daoU.getUserImageName(request.session.currentUser,function(err,content){
        if(err){
            response.status(500);
            
        }
        else{
            response.status(200);
            if(content=="") 
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
app.get("/sinRespuesta",AccessControl, function(request, response) {
    let questList=null;
    daoQ.getQuestionWithoutReply(function(err, content){
        if(err){
            response.status(500);
        }
        else{
            response.status(200);
            questList=content;
            response.render("QuestWithoutReply" , {questList});
        }
    });
    
}); 

app.get("/SBTag/:tag",AccessControl, function(request, response) {
    let questList=null;
    daoQ.searchByTag(request.params.tag ,function(err, content){
        if(err){
            response.status(500);
        }
        else{
            response.status(200);
            questList=content;
            questList.filter = request.params.tag;
            response.render("SearchByTag" , {questList});
        }
    });
});

app.post("/SBText",AccessControl, function(request, response) {
    if(request.body.textForm!=""){
        daoQ.searchByTextBar(request.body.textForm ,function(err, content){
            if(err){
                response.status(500);
            }
            else{
                response.status(200);
                let questList=content;
                response.render("SearchByText" , {questList});
            }
        });
    }
});
app.get("/OneQuestion/:id",AccessControl, function(request, response) {
    let info= {
        nvisits:0,
        question:"",
        voteq:"",
        replys:""
    };
    daoQ.getQuestion(request.params.id ,function(err, content){ //coge la pregunta en si
        if(err){
            response.status(500);
        }
        else{
            info.question=content[0];

            daoQ.getVotes(request.params.id, function(err,content){
                if(err){
                    response.status(500);
                }
                else
                {
                    info.voteq=content;
                    daoR.getAllReplys(info.question.id, function(err,content){ //usando el id busca todas las respuestas a esa pregunta
                        if(err){
                            response.status(500);
                        }
                        else{
                            info.replys=content;
                            daoQ.doAVisit(request.session.nick, info.question.id, function(err){
                                    daoQ.getNumVisits(info.question.id , function(err,content){ //contabiliza la visita
                                        if(err){
                                            response.status(500);
                                        }
                                        else{
                                            info.nvisits=content;
                                            response.render("OneQuestion" , {info}); //renderiza la pregunta con sus respuestas
                                        }
                                    });
                            });
                        }
                    });
                }
            })
        }     
    });
});

app.get("/createQuestion",AccessControl, function(request,response){
    let errorMsg=null;
    response.render("createQuestion" , {errorMsg});
});

app.post("/createQuestionForm",AccessControl, function(request, response){
    let q={
        nick:request.session.nick,
        title:request.body.titulo,
        text:"",
        tags:[]
    };
    let textoBruto = request.body.cuerpo.split(" ");
    q.tags = textoBruto.filter(v => v.startsWith("@") == true);
    q.tags=q.tags.map(v => v.substr(1));
    q.text = textoBruto.filter(v => v.startsWith("@") == false).join(" ");

    daoQ.createQuestion(q,function(err){
        if(err){
            let errorMsg="El titulo ya existe";
            response.render("createQuestion" , {errorMsg});
        }
        else{
            response.redirect("/AllQuestions");
        }
    });
});
//---------------------------------------------------------- fin 404 - Posts

//---------------------------------------------------------- Perfil
app.get("/profile", AccessControl, function(request, response) {
    let userInfo = null;
    daoU.getUserProfile(request.session.nick, function(err, content){
        if(err){
            response.status(500);
        }
        else{
            response.status(200);
            userInfo=content;
            response.render("profile" , {userInfo});
        }
    });
});

app.get("/profile/:nick", AccessControl, function(request, response) {
    let userInfo = null;
    daoU.getUserProfile(request.params.nick, function(err, content){
        if(err){
            response.status(500);
        }
        else{
            response.status(200);
            userInfo=content;
         
            response.render("profile" , {userInfo});
        }
    });
});

app.get("/allUsers", AccessControl, function(request, response) {
    let userslist = null;
    daoU.getAllUsers(function(err, content){
        if(err){
            response.status(500);
        }
        else{
            response.status(200);
            userslist=content;
            response.render("allUsers" , {userslist});
        }
    });
});

app.post("/UserFilter",AccessControl, function(request, response) {
    if(request.body.userF!=""){
        daoU.searchByTextBar(request.body.userF ,function(err, content){
            if(err){
                response.status(500);
            }
            else{
                response.status(200);
                let userslist=content;
                response.render("SearchUser" , {userslist});
            }
     
        });
    }
});

//---------------------------------------------------------- fin Perfil

//---------------------------------------------------------- Reply

app.get("/voteLikeQuestion/:id/:nick",AccessControl, function(request,response){
    daoQ.userVotedQuestion(request.session.nick, request.params.id,function(err,content)
    {
        if(err){
            response.status(500);
        }
        else{
            if(!content)
            {
                daoQ.voteQuestion(request.session.nick, 1, request.params.id, function(err){
                    if(err)
                    {
                        response.status(500);
                    }
                    else{
                        daoU.modifyRep(request.params.nick,10,function(err){
                            if(err){
                                response.status(500);
                            }
                            else{
                                response.redirect("/OneQuestion/" + request.params.id);
                            }
                        })
                       
                    }
                })
            }
            else{
                response.redirect("/OneQuestion/" + request.params.id);
            }
            
        }
    })
});

app.get("/voteDislikeQuestion/:id/:nick",AccessControl, function(request,response){
    daoQ.userVotedQuestion(request.session.nick,request.params.id,function(err,content)
    {
        if(err){
            response.status(500);
        }
        else{
            if(!content)
            {
                daoQ.voteQuestion(request.session.nick, -1, request.params.id, function(err){
                    if(err)
                    {
                        response.status(500);
                    }
                    else{
                        daoU.modifyRep(request.params.nick,-2,function(err){
                            if(err){
                                response.status(500);
                            }
                            else{
                                response.redirect("/OneQuestion/" + request.params.id);
                            }
                        })
                    }
                })
            }
            else{
                response.redirect("/OneQuestion/" + request.params.id);
            }
        }
    })
});

app.get("/voteLikeReply/:idReply/:idQuestion/:nick",AccessControl, function(request,response){
    daoR.userVotedReply(request.session.nick, request.params.idReply,function(err,content)
    {
        if(err){
            response.status(500);
        }
        else{
            if(!content)
            {
                daoR.voteReply(request.session.nick,1,request.params.idReply, function(err){
                    if(err){
                        response.status(500);
                    }
                    else{
                     daoU.modifyRep(request.params.nick,10,function(err){
                         if(err){
                             response.status(500);
                         }
                         else{
                             response.redirect("/OneQuestion/" + request.params.idQuestion);
                         }
                     })
                     
                    }
                })
            }
            else{
                response.redirect("/OneQuestion/" + request.params.idQuestion);
            }
        }

    })


   

});
app.get("/voteDislikeReply/:idReply/:idQuestion/:nick",AccessControl, function(request,response){
    daoR.userVotedReply(request.session.nick,request.params.idReply,function(err,content)
    {
        if(err){
            response.status(500);
        }
        else{
            if(!content)
            {
                daoR.voteReply(request.session.nick,-1,request.params.idReply, function(err){
                    if(err){
                        response.status(500);
                    }
                    else{
                        daoU.modifyRep(request.params.nick,-2,function(err){
                            if(err){
                                response.status(500);
                            }
                            else{
                                response.redirect("/OneQuestion/" + request.params.idQuestion);
                            }
                        })
                    }
                })
            }
            else{
                response.redirect("/OneQuestion/" + request.params.idQuestion);
            }
        }
    })
});

app.post("/postReply/:question/:nick", AccessControl, function(request,response){
   daoR.createReply(request.params.question, request.body.cuerpo, request.params.nick, function(err){
       if(err){
           response.redirect("/404");
       }
       else {
           response.redirect("/allQuestions");
       }
   });
});
//---------------------------------------------------------- fin Reply

// Arrancar el servidor
app.listen(config.port, function(err) {
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