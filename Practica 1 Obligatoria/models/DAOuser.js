"use strict";

class DAOUsers {

    constructor(pool) {
        this.pool = pool;
    }

    isUserCorrect(email, password, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT nick FROM users WHERE email = ? AND password = ?",
                    [email, password],
                    function (err, rows) {
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

    getMVPTag(nick,callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"), null);
            }
            else {
                connection.query("SELECT t.tag FROM question q RIGHT JOIN tags t ON q.id=t.IDquestion WHERE nick = ?",
                    [nick],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"), null);
                        }
                        else {
                            if (rows.length == 0) {
                                callback(null, null); //no esta el usuario
                            }
                            else {
                                let hashtag = new Map 
                                rows.forEach(e => {
                                    if(hashtag.has(e))
                                    {
                                        let n = hashtag.get(e) + 1;
                                        hashtag.delete(e);
                                        hashtag.set(e,n);
                                    }
                                    else{
                                        hashtag.set(e,1);
                                    }
                                });
                                let tag;
                                let tmax = 0;
                                hashtag.forEach(e => {
                                    if(e.value > tmax)
                                    {
                                        tag= e.key;
                                    }
                                });
                                callback(null, tag);
                            }
                        }
                    });
            }
        });

    }

    insertNewMember(email, password, nick, img, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {

                connection.query("INSERT INTO users (nick, email, password, icon)  VALUES (?,?,?,?)",
                    [nick, email, password, img],
                    function (err) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos en users"));
                        }
                        else {
                            connection.query("INSERT INTO stats (nick, reputation, nQuestions, nAnswers) VALUES(?,?,?,?)",
                                [nick, 1, 0, 0],
                                function (err, rows) {
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
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"), null);
            }
            else {
                connection.query("SELECT icon FROM users WHERE email = ?",
                    [email],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"), null);
                        }
                        else {
                            if (rows.length == 0) {
                                callback(new Error("no existe el usuario"), null); //no esta el usuario
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
    getMinInfoByEmail(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT nick, icon, date FROM users WHERE email = ?",
                    [email],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"), null);
                        }
                        else {
                            if (rows.length == 0) {
                                callback(new Error("el usuario no existe"), null); //no esta el usuario
                            }
                            else {
                                if (rows[0].icon == "") rows[0].icon = null;
                                callback(null, rows[0]);
                            }
                        }
                    });
            }
        });
    }

    //Devuelve los datos necesarios para mostrar el perfil de un usuario: medallas, estadisticas etc
    getUserProfile(nick, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT U.nick, U.icon, U.date, S.reputation , S.nQuestions, S.nAnswers FROM users U JOIN stats S on U.nick=S.nick WHERE U.nick = ?",//"SELECT * FROM user u JOIN medals m (using nick) JOIN stats s (using nick) WHERE nick = ?" ,
                    [nick],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {

                            callback(new Error("Error de acceso a la base de datos en el join"), null);
                        }
                        else {
                            if (rows.length === 0) {
                                callback(new Error("no existe el usuario"), null); //no esta el usuario
                            }
                            else { //en caso de haber devuelto algo
                                //Inicializamos valores
                                let datos = {
                                    nick: "",
                                    icon: "",
                                    date: "",
                                    reputation: 0,
                                    nQuestions: 0,
                                    nAnswers: 0,
                                    medals: [],
                                };
                                datos.nick = rows[0].nick;
                                datos.icon = rows[0].icon;
                                datos.date = rows[0].date;
                                datos.reputation = rows[0].reputation;
                                datos.nQuestions = rows[0].nQuestions;
                                datos.nAnswers = rows[0].nAnswers;

                                //Obtenemos el array de medallas
                                connection.query("SELECT * FROM medals WHERE nick = ?",
                                    [nick],
                                    function (err, row) {
                                        if (err) {

                                            callback(new Error("Error de acceso a la base de datos en medal"), null);
                                        }
                                        else {


                                            for (let i = 0; i < row.length; i++) {
                                                let medal = {
                                                    type: "",
                                                    text: "",
                                                    number: 1,
                                                };
                                                medal.type = row[i].type;
                                                medal.text = row[i].text;
                                                medal.number = row[i].number;
                                                datos.medals.push(medal);
                                            }
                                        }
                                        callback(null, datos);
                                    });

                            }

                        }
                    });
            }
        });
    }

    getAllUsers(callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT u.nick, u.icon, u.tag, s.reputation FROM users u join stats s on u.nick=s.nick",
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos "));
                        }
                        else {
                            
                            
                            callback(null, rows);
                        }

                    });
            }
        });

    }

    searchByTextBar(text, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT u.nick, u.icon, u.tag, s.reputation FROM users u join stats s on u.nick=s.nick where instr( u.nick , ? ) order by u.nick;",
                    [text],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos "));
                        }
                        else {
                            callback(null, rows);
                        }
                    });
            }
        });
    }

    modifyRep(nick, value, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT reputation from stats where nick = ?",
                    [nick],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos "));
                        }
                        else {
                            let rep = rows[0].reputation + value;
                            if (rep < 1)
                                rep = 1;
                            connection.query("UPDATE stats set reputation = ? where nick = ?  ",
                                [rep, nick],
                                function (err) {
                                    if (err) {
                                        callback(new Error("Error de conexión a la base de datos"));
                                    }
                                    else {
                                        callback(null, true)
                                    }
                                })
                        }
                    });
            }
        });
    }
}
module.exports = DAOUsers;