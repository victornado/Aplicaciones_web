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

// Crear un servidor Express.js
const app = express();

// Crear un pool de conexiones a la base de datos de MySQL
const pool = mysql.createPool(config.mysqlConfig);

//colocamos ejs como generador de plantillas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//añadimos el middleware bodyParser
app.use(bodyParser.urlencoded({ extended: false }));

// Crear una instancia de DAO's
const daoQ = new DAOquestion(pool);
const daoU = new DAOuser(pool); //funciona 100%
const daoR = new DAOreply(pool);

//question

let q={
    nick:"Eduardo",
    title:"bienvendido22",
    text:"carta de bienvenida 2",
    tags:["carta","sdagh"]
};
// let a =daoQ.createQuestion(q,function(err){
//     if(err) console.log(err);
//     else console.log("DONE");
// });//funciona 100%

// let a =daoQ.getAllQuestions(function(err,content){
//         if(err) console.log(err);
//         else console.log(content);
//     });//funciona 100%

// let a =daoQ.getQuestion(q.title,function(err,content){
//         if(err) console.log(err);
//         else console.log(content);
//     });//funciona 100%

// let id=daoQ.getID(q.title,function(err,content){
//     if(err) console.log(err);
//     else
//         daoQ.doAVisit("Alfredo", content, function(err){
//             if(err) console.log(err);
//             else console.log("DONE");
//         });
// });//funciona 100%

// let a =daoQ.getQuestionWithoutReply(function(err,content){
//         if(err) console.log(err);
//         else console.log(content);
// });//funciona 100%

// let a =daoQ.searchByTag("sdagh",function(err,content){
//         if(err) console.log(err);
//         else console.log(content);
// });//funciona 100%

//post que buscas: "arrays en c++ con programacion dinamica"
//lo que pones en la barra: "programacion dinamica"
//el ejs hace un split de la frase introducida separando en array
let entrada = ["22"];
let a =daoQ.searchByTextBar(entrada,function(err,content){
        if(err) console.log(err);
        else console.log(content);
});//queda comprobar este


