"use strict";

class DAOReply {

    constructor(pool) {
        this.pool = pool;
    }

    getAllReplys(idQuestion, callback) {

        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT r.id , u.icon, r.nick, sum(v.value) as votes, r.text, r.date from reply r join users u on r.nick=u.nick left join votereply v on v.IDreply=r.ID where r.idQuestion = ? group by r.ID",
                    [idQuestion],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"), null);
                        }
                        else {
                            let list = [];
                            for (var i = 0; i < rows.length; i++) {
                                let array = {
                                    id: "",
                                    nick: "",
                                    icon: "",
                                    date: "",
                                    votes: "",
                                    text: "",
                                };

                                array.id = rows[i].id;
                                array.nick = rows[i].nick;
                                array.icon = rows[i].icon;
                                array.date = rows[i].date;

                                array.votes = rows[i].votes;
                                if (array.votes == null) {
                                    array.votes = 0;
                                }
                                array.text = rows[i].text;
                                list.push(array);
                            }
                            if (rows.length == 0) list = null;
                            callback(null, list);
                        }
                    });
            }
        });


    }

    getVotes(idReply, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"), null);
            }
            else {
                connection.query("Select sum(value) as sum from votereply where IDreply = ? ",
                    [idReply],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"), null);
                        }
                        else {
                            let value = rows[0].sum;
                            if (rows[0].sum == null) {
                                value = 0;
                            }
                            callback(null, value);
                        }
                    });
            }
        });
    }

    voteReply(nick, voto, idReply, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("INSERT INTO votereply (Nick, IDreply, value)  VALUES (?,?,?)",
                    [nick, idReply, voto],
                    function (error) {
                        connection.release(); // devolver al pool la conexión
                        if (error) {
                            callback(null);
                        }
                        else {//ya lo ha insertado antes
                            connection.query("Select sum(value) as sum from votereply where IDreply = ? ",
                                [idReply],
                                function (error2, value2) {
                                    if (error2) {
                                        callback(new Error("Error de acceso a la base de datos"), null);
                                    }
                                    else {
                                        let value = value2[0].sum;
                                        if (value == null) {
                                            value = 0;
                                        }
                                        connection.query("SELECT nick from reply where id= ?",
                                            [idReply],
                                            function (err, nick) {
                                                if (err) {
                                                    callback(new Error("Error de acceso a la base de datos"));
                                                }
                                                else {
                                                    if (value == 2) {
                                                        connection.query("SELECT s.number from medals s where s.text= ? and nick=?",
                                                            ["Respuesta interesante", nick[0].nick],
                                                            function (err, number) {
                                                                if (number[0] == undefined) {
                                                                    connection.query("insert into medals (nick, type, text, number) values (?,?,?,?)",
                                                                        [nick[0].nick, "bronce", "Respuesta interesante", 1],
                                                                        function (err) {
                                                                            callback(null);
                                                                        });
                                                                }
                                                                else {
                                                                    connection.query("select number from medals where nick=? and text=?",
                                                                        [nick[0].nick, "Respuesta interesante"],
                                                                        function (err, aux) {

                                                                            connection.query("update medals set number=? where nick=? and text=?",
                                                                                [aux[0].number + 1, nick[0].nick, "Respuesta interesante"],
                                                                                function (err) {
                                                                                    callback(null);
                                                                                });
                                                                        });
                                                                }
                                                            });
                                                    }
                                                    else if (value == 4) {

                                                        connection.query("SELECT s.number from medals s where s.text= ? and nick=?",
                                                            ["Buena respuesta", nick[0].nick],
                                                            function (err, number) {
                                                                if (number[0] == undefined)
                                                                    connection.query("insert into medals (nick, type, text, number) values (?,?,?,?)",
                                                                        [nick[0].nick, "plata", "Buena respuesta", 1],
                                                                        function (err) {
                                                                            callback(null);
                                                                        });
                                                                else {
                                                                    connection.query("select number from medals where nick=? and text=?",
                                                                        [nick[0].nick, "Buena respuesta"],
                                                                        function (err, aux) {

                                                                            connection.query("update medals set number=? where nick=? and text=?",
                                                                                [aux[0].number + 1, nick[0].nick, "Buena respuesta"],
                                                                                function (err) {
                                                                                    callback(null);
                                                                                });
                                                                        });
                                                                }
                                                            });

                                                    }
                                                    else if (value == 6) {

                                                        connection.query("SELECT s.number from medals s where s.text= ? and nick=?",
                                                            ["Excelente respuesta", nick[0].nick],
                                                            function (err, number) {
                                                                if (number[0] == undefined)
                                                                    connection.query("insert into medals (nick, type, text, number) values (?,?,?,?)",
                                                                        [nick[0].nick, "oro", "Excelente respuesta", 1],
                                                                        function (err) {
                                                                            callback(null)
                                                                        });
                                                                else {
                                                                    connection.query("select number from medals where nick=? and text=?",
                                                                        [nick[0].nick, "Excelente respuesta"],
                                                                        function (err, aux) {

                                                                            connection.query("update medals set number=? where nick=? and text=?",
                                                                                [aux[0].number + 1, nick[0].nick, "Excelente respuesta"],
                                                                                function (err) {
                                                                                    callback(null);
                                                                                });
                                                                        });
                                                                }
                                                            });

                                                    }
                                                    else {
                                                        callback(null);
                                                    }
                                                }
                                            });
                                    }
                                });
                        }

                    });
            }

        });
    }

    userVotedReply(nick, id, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("Select * from votereply where Nick = ? and IDreply = ? ",
                    [nick, id],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (rows[0] == undefined) {
                                callback(null, false);
                            }
                            else {
                                callback(null, true);
                            }
                        }
                    });
            }
        });
    }

    createReply(idQuestion, text, nick, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                //creamos la reply

                connection.query("INSERT INTO reply (nick, idQuestion, text)  VALUES (?,?,?)",
                    [nick, idQuestion, text],
                    function (err) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos al insertar"));
                        }
                        else {   //actualizamos los stats del usuario
                            connection.query("Select nAnswers from stats where nick = ? ",
                                [nick],
                                function (err, rows) {

                                    if (err) {
                                        callback(new Error("Error de acceso a la base de datos select"));
                                    }
                                    else {

                                        let n = rows[0].nAnswers + 1;
                                        connection.query("UPDATE stats set nAnswers = ? where nick = ? ",
                                            [n, nick],
                                            function (err) {

                                                if (err) {
                                                    callback(new Error("Error de acceso a la base de datos update"));
                                                }
                                                callback(null);
                                            });

                                    }
                                });
                        }

                    });
            }
        });
    }

}
module.exports = DAOReply;