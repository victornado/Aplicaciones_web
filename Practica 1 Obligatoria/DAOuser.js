"use strict";

class DAOUsers {

    constructor(pool){
        this.pool=pool;
    }

    isUserCorrect(email, password, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT nick FROM users WHERE email = ? AND password = ?" ,
                [email,password],
                function(err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if (rows.length === 0) {
                            callback(null, false); //no está el usuario con el password proporcionado
                        }
                        else {
                            callback(null, true);
                        }           
                    }
                });
            }
        });     
    }

    insertNewMember(email,password,nick,img,callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                var f = new Date();
                let fecha = (f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear());
                connection.query("INSERT INTO users (nick, email, password, icon, date)  VALUES (?,?,?,?,?)",
                [nick, email, password, img, fecha],
                function(err) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos en users"));
                    }
                    else{
                        connection.query("INSERT INTO stats (nick, reputation, nQuestions, nAnswers) VALUES(?,?,?,?)" ,
                        [nick,1,0,0],
                        function(err, rows) {
                  
                            if (err) {
                                callback(new Error("Error de acceso a la base de datos de stats"));
                            }
                            else {
                                callback(null);       
                            }
                        });
                    }
                });  
            }
        });     
    }

    getUserImageName(email, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"),null);
            }
            else {
                connection.query("SELECT icon FROM users WHERE email = ?" ,
                [email],
                function(err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"),null);
                    }
                    else {
                        if (rows.length == 0) {
                            callback(new Error("no existe el usuario"),null); //no esta el usuario
                        }
                        else {
                            callback(null, rows[0].icon);
                        }           
                    }
                });
            }
        });     
    } 

    //Dado un email devuelve la informacion basica de un usuario (nick, foto, date)
    getMinInfoByEmail(email,callback){
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT nick, icon, date FROM users WHERE email = ?" ,
                [email],
                function(err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"),null);
                    }
                    else {
                        if (rows.length == 0) {
                            callback(new Error("el usuario no existe"),null); //no esta el usuario
                        }
                        else {
                            callback(null,rows[0]);
                        }           
                    }
                });
            }
        });     
    }

    //Devuelve los datos necesarios para mostrar el perfil de un usuario: medallas, estadisticas etc
    getUserProfile(nick, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT U.nick, U.icon, U.date, S.reputation , S.nQuestions, S.nAnswers FROM users U JOIN stats S WHERE U.nick = ?",//"SELECT * FROM user u JOIN medals m (using nick) JOIN stats s (using nick) WHERE nick = ?" ,
                [nick],
                function(err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                       
                        callback(new Error("Error de acceso a la base de datos en el join"));
                    }
                    else {
                        if (rows.length === 0) {
                            callback(new Error("no existe el usuario")); //no esta el usuario
                        }
                        else { //en caso de haber devuelto algo
                            //Inicializamos valores
                            let  datos={
                                nick:"",
                                icon:"",
                                date:"",
                                reputation:0,
                                nQuestions:0,
                                nAnswers:0,
                                medals:[],
                            };
                            datos.nick=rows[0].nick;
                            datos.icon=rows[0].icon;
                            datos.date=rows[0].date;
                            datos.reputation=rows[0].reputation;
                            datos.nQuestions=rows[0].nQuestions;
                            datos.nAnswers=rows[0].nAnswers;

                            //Obtenemos el array de medallas
                            connection.query("SELECT * FROM medals WHERE nick = ?" ,
                            [nick],
                            function(err, rows) {
                                if (err) {
                                 
                                    callback(new Error("Error de acceso a la base de datos en medal"));
                                }
                                else {
                                    if (rows.length === 0) {
                                        
                                    }
                                    else {
                                        //cargamos el array de medallas
                                        let medal;
                                       for(var i=0;i<rows.length;i++)
                                       {
                                           medal.type=row[i].type;
                                           medal.text=row[i].text;
                                           medal.number=row[i].number;
                                           datos.medals.push(medal);
                                       }
                                    }           
                                }
                            });
                            callback(datos);
                        }     
                              
                    }
                });
            }
        });    
    }

    getAllUsers(callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT u.nick, u.icon, u.tag, s.reputation FROM users u join stats s on u.nick=s.nick" ,
                function(err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                       
                        callback(new Error("Error de acceso a la base de datos "));
                        callback(new Error("Error de acceso a la base de datos "));
                        callback(new Error("Error de acceso a la base de datos "));
                    }
                    else {
                        if (rows.length === 0) {
                            callback(null); //no esta el usuario
                        }
                        else {
                            callback(rows);
                        }           
                    }
                });
            }
        });     

    }


}
module.exports = DAOUsers;