// config.js
"use strict";
module.exports = {
   mysqlConfig: {
           host: "localhost",     // Ordenador que ejecuta el SGBD
           user: "root",          // Usuario que accede a la BD
           password: "",          // Contraseña con la que se accede a la BD
           database: "practica 1"     // Nombre de la base de datos
   },
     port: 3000                 // Puerto en el que escucha el servidor
};

/*
notas del miercoles 9:
-Falta arreglar el searchByText de DAOquestion y comprobar funcionamiendo de DAOreply
-Funciones de login/logout (login algo tenemos pero logout creo que no) [para el 4]
-Falta mirar todo lo de las medallas y las stats de cada usuario , ejemplo: calculateReputation() , getUsersMostUsedTag [para el 8]

*/
