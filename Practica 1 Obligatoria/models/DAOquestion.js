"use strict";

class DAOQuestion {

    constructor(pool) {
        this.pool = pool;
    }

    getQuestion(id, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT q.id, q.title, q.text, q.date, u.icon, t.tag, u.nick, v.value from tags t right join question q on t.idQuestion=q.id join users u on u.nick = q.nick left join votequestion v on q.id=v.IDQuestion where q.id= ?",
                    [id],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"), null);
                        }
                        else {
                            let list = [];
                            let title = "";
                            let cont = 0;
                            for (var i = 0; i < rows.length; i++) {
                                if (rows[i].title != title) {//no esta 

                                    let array = {
                                        id: "",
                                        title: "",
                                        text: "",
                                        date: "",
                                        nick: "",
                                        icon: "",
                                        tags: [],
                                        value: 0
                                    };

                                    title = rows[i].title;
                                    array.id = rows[i].id;
                                    array.title = rows[i].title;
                                    array.text = rows[i].text;
                                    array.date = rows[i].date;
                                    array.nick = rows[i].nick;
                                    array.icon = rows[i].icon;
                                    array.value = rows[i].value;
                                    array.tags.push(rows[i].tag);
                                    list[cont] = array;
                                    cont++;
                                }
                                else {
                                    list[cont - 1].tags.push(rows[i].tag);
                                }
                            }
                            callback(null, list);
                        }
                    });
            }
        });
    }

    getAllQuestions(callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT q.id, q.title, q.text, q.date, u.icon,t.tag, u.nick from question q join users u on u.nick = q.nick left join tags t on t.idQuestion=q.id order by q.date desc",
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"), null);
                        }
                        else {
                            let list = [];
                            let title = "";
                            let cont = 0;
                            for (var i = 0; i < rows.length; i++) {
                                if (rows[i].title != title) {//no esta 

                                    let array = {
                                        id: "",
                                        title: "",
                                        text: "",
                                        date: "",
                                        nick: "",
                                        icon: "",
                                        tags: [],
                                    };

                                    title = rows[i].title;
                                    array.id = rows[i].id;
                                    array.title = rows[i].title;
                                    array.text = rows[i].text;
                                    array.date = rows[i].date;
                                    array.nick = rows[i].nick;
                                    array.icon = rows[i].icon;
                                    array.tags.push(rows[i].tag);
                                    list[cont] = array;
                                    cont++;
                                }
                                else {
                                    list[cont - 1].tags.push(rows[i].tag);
                                }
                            }
                            callback(null, list);
                        }
                    });
            }
        });
    }
    //TODO actualizar los stats del usuario
    createQuestion(q, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {

                connection.query("insert into question (nick, title, text) values (?,?,?)",
                    [q.nick, q.title, q.text],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos en question"));
                        }
                        else {
                            //insertamos los tag
                            let tam = q.tags.length;
                            let myString = "";
                            q.tags.map(v => myString += "(?,?),");
                            myString = myString.substr(0, myString.length - 1);
                            let values = [];
                            q.tags.map(v => values.push([rows.insertId, v]));
                            let values2 = [];
                            if (values.length > 5) {
                                values2 = values.slice(0, 5);
                            }
                            else {
                                values2 = values;
                            }
                            connection.query("insert into tags (IDQuestion, tag) values ?",
                                [values2],
                                function (err, rows) {

                                    connection.query("Select nQuestions from stats where nick = ? ",
                                        [q.nick],
                                        function (err, rows) {
                                            if (err) {
                                                callback(new Error("Error de acceso a la base de datos select"));
                                            }
                                            else {

                                                let n = rows[0].nQuestions + 1;
                                                connection.query("UPDATE stats set nQuestions = ? where nick = ? ",
                                                    [n, q.nick],
                                                    function (err) {

                                                        if (err) {
                                                            callback(new Error("Error de acceso a la base de datos update"));
                                                        }
                                                        else
                                                            callback(null);
                                                    });

                                            }
                                        });

                                });

                        }
                    });
            }
        });
    }

    getID(title, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("select id from question where title= ?",
                    [title],
                    function (err, rows) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"), null);
                        }
                        else {
                            callback(null, rows[0].id);
                        }
                    });
            }
        });
    }

    doAVisit(idUser, idQuestion, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("insert into visit values (?,?)",
                    [idUser, idQuestion],
                    function (err) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(null);
                        }
                        else {
                            connection.query("select count(*) as visits from visit where IDQuestion = ? ",
                                [idQuestion],
                                function (err, value2) {
                                    let value = value2[0].visits;
                                    if (err) {
                                        callback(new Error("Error de acceso a la base de datos"), null);
                                    }
                                    else {
                                        connection.query("SELECT nick from question where id= ?",
                                            [idQuestion],
                                            function (err, nick) {
                                                if (err) {
                                                    callback(new Error("Error de acceso a la base de datos"));
                                                }
                                                else {
                                                    if (value == 2) {
                                                        connection.query("SELECT s.number from medals s where s.text= ? and nick=?",
                                                            ["Pregunta popular", nick[0].nick],
                                                            function (err, number) {
                                                                if (number[0] == undefined) {
                                                                    connection.query("insert into medals (nick, type, text, number) values (?,?,?,?)",
                                                                        [nick[0].nick, "bronce", "Pregunta popular", 1],
                                                                        function (err) {
                                                                            callback(null);
                                                                        });
                                                                }
                                                                else {
                                                                    connection.query("select number from medals where nick=? and text=?",
                                                                        [nick[0].nick, "Pregunta popular"],
                                                                        function (err, aux) {

                                                                            connection.query("update medals set number=? where nick=? and text=?",
                                                                                [aux[0].number + 1, nick[0].nick, "Pregunta popular"],
                                                                                function (err) {
                                                                                    callback(null);
                                                                                });
                                                                        });
                                                                }
                                                            });
                                                    }
                                                    else if (value == 4) {

                                                        connection.query("SELECT s.number from medals s where s.text= ? and nick=?",
                                                            ["Pregunta destacada", nick[0].nick],
                                                            function (err, number) {
                                                                if (number[0] == undefined)
                                                                    connection.query("insert into medals (nick, type, text, number) values (?,?,?,?)",
                                                                        [nick[0].nick, "plata", "Pregunta destacada", 1],
                                                                        function (err) {
                                                                            callback(null)
                                                                        });
                                                                else {
                                                                    connection.query("select number from medals where nick=? and text=?",
                                                                        [nick[0].nick, "Pregunta destacada"],
                                                                        function (err, aux) {

                                                                            connection.query("update medals set number=? where nick=? and text=?",
                                                                                [aux[0].number + 1, nick[0].nick, "Pregunta destacada"],
                                                                                function (err) {
                                                                                    callback(null);
                                                                                });
                                                                        });
                                                                }
                                                            });

                                                    }
                                                    else if (value == 6) {

                                                        connection.query("SELECT s.number from medals s where s.text= ? and nick=?",
                                                            ["Pregunta famosa", nick[0].nick],
                                                            function (err, number) {
                                                                if (number[0] == undefined)
                                                                    connection.query("insert into medals (nick, type, text, number) values (?,?,?,?)",
                                                                        [nick[0].nick, "oro", "Pregunta famosa", 1],
                                                                        function (err) {
                                                                            callback(null);
                                                                        });
                                                                else {
                                                                    connection.query("select number from medals where nick=? and text=?",
                                                                        [nick[0].nick, "Pregunta famosa"],
                                                                        function (err, aux) {

                                                                            connection.query("update medals set number=? where nick=? and text=?",
                                                                                [aux[0].number + 1, nick[0].nick, "Pregunta famosa"],
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

    getNumVisits(idQuestion, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"), null);
            }
            else {
                connection.query("select count(*) as visits from visit where IDQuestion = ? ",
                    [idQuestion],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {

                            callback(new Error("Error de acceso a la base de datos"), null);
                        }
                        else {
                            if (rows.length === 0) {
                                callback(null, 0);
                            }
                            else {

                                callback(null, rows[0].visits);
                            }
                        }
                    });
            }
        });
    }

    getQuestionWithoutReply(callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT q.id, q.title, q.text, q.date, u.icon, t.tag, u.nick from question q join users u on u.nick=q.nick left join tags t on t.idQuestion=q.id left join reply r on r.idQuestion=q.id where r.idQuestion is NULL order by q.date desc;",
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"), null);
                        }
                        else {
                            let list = [];
                            let title = "";
                            let cont = 0;
                            for (var i = 0; i < rows.length; i++) {
                                if (rows[i].title != title) {//no esta 

                                    let array = {
                                        id: "",
                                        title: "",
                                        text: "",
                                        date: "",
                                        nick: "",
                                        icon: "",
                                        tags: [],
                                    };

                                    title = rows[i].title;
                                    array.title = rows[i].title;
                                    array.text = rows[i].text;
                                    array.id = rows[i].id;
                                    array.date = rows[i].date;
                                    array.nick = rows[i].nick;
                                    array.icon = rows[i].icon;
                                    array.tags.push(rows[i].tag);
                                    list[cont] = array;
                                    cont++;
                                }
                                else {
                                    list[cont - 1].tags.push(rows[i].tag);
                                }
                            }
                            callback(null, list);
                        }
                    });
            }
        });
    }

    userVotedQuestion(nick, id, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("Select * from votequestion where nick = ? and IDQuestion = ?",
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

    voteQuestion(nick, voto, idQuestion, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("INSERT INTO votequestion (nick, IDQuestion, value)  VALUES (?,?,?)",
                    [nick, idQuestion, voto],
                    function (err) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        connection.query("SELECT sum(value) as sum from votequestion where idQuestion= ?",
                            [idQuestion],
                            function (err, row) {
                                let value = row[0].sum;
                                connection.query("SELECT nick from question where id= ?",
                                    [idQuestion],
                                    function (err, nick) {
                                        if (err) {
                                            callback(new Error("Error de acceso a la base de datos"));
                                        }
                                        else {

                                            if (value == 1) {
                                                connection.query("SELECT s.number from medals s where s.text= ? and nick=?",
                                                    ["Estudiante", nick[0].nick],
                                                    function (err, number) {
                                                        if (number[0] == undefined)
                                                            connection.query("insert into medals (nick, type, text, number) values (?,?,?,?)",
                                                                [nick[0].nick, "bronce", "Estudiante", 1],
                                                                function (err) {
                                                                    callback(null);
                                                                });
                                                        else {
                                                            connection.query("select number from medals where nick=? and text=?",
                                                                [nick[0].nick, "Estudiante"],
                                                                function (err, aux) {

                                                                    connection.query("update medals set number=? where nick=? and text=?",
                                                                        [aux[0].number + 1, nick[0].nick, "Estudiante"],
                                                                        function (err) {
                                                                            callback(null);
                                                                        });
                                                                });
                                                        }
                                                    });
                                            }
                                            else if (value == 2) {

                                                connection.query("SELECT s.number from medals s where s.text= ? and nick=?",
                                                    ["Pregunta interesante", nick[0].nick],
                                                    function (err, number) {
                                                        if (number[0] == undefined)
                                                            connection.query("insert into medals (nick, type, text, number) values (?,?,?,?)",
                                                                [nick[0].nick, "bronce", "Pregunta interesante", 1],
                                                                function (err) {
                                                                    callback(null)
                                                                });
                                                        else {
                                                            connection.query("select number from medals where nick=? and text=?",
                                                                [nick[0].nick, "Pregunta interesante"],
                                                                function (err, aux) {

                                                                    connection.query("update medals set number=? where nick=? and text=?",
                                                                        [aux[0].number + 1, nick[0].nick, "Pregunta interesante"],
                                                                        function (err) {
                                                                            callback(null);
                                                                        });
                                                                });
                                                        }
                                                    });


                                            }
                                            else if (value == 4) {

                                                connection.query("SELECT s.number from medals s where s.text= ? and nick=?",
                                                    ["Buena pregunta", nick[0].nick],
                                                    function (err, number) {
                                                        if (number[0] == undefined)
                                                            connection.query("insert into medals (nick, type, text, number) values (?,?,?,?)",
                                                                [nick[0].nick, "plata", "Buena pregunta", 1],
                                                                function (err) {
                                                                    callback(null);
                                                                });
                                                        else {
                                                            connection.query("select number from medals where nick=? and text=?",
                                                                [nick[0].nick, "Buena pregunta"],
                                                                function (err, aux) {

                                                                    connection.query("update medals set number=? where nick=? and text=?",
                                                                        [aux[0].number + 1, nick[0].nick, "Buena pregunta"],
                                                                        function (err) {
                                                                            callback(null);
                                                                        });
                                                                });
                                                        }
                                                    });

                                            }
                                            else if (value == 6) {

                                                connection.query("SELECT s.number from medals s where s.text= ? and nick=?",
                                                    ["Excelente pregunta", nick[0].nick],
                                                    function (err, number) {
                                                        if (number[0] == undefined)
                                                            connection.query("insert into medals (nick, type, text, number) values (?,?,?,?)",
                                                                [nick[0].nick, "oro", "Excelente pregunta", 1],
                                                                function (err) {
                                                                    callback(null);
                                                                });
                                                        else {
                                                            connection.query("select number from medals where nick=? and text=?",
                                                                [nick[0].nick, "Excelente pregunta"],
                                                                function (err, aux) {

                                                                    connection.query("update medals set number=? where nick=? and text=?",
                                                                        [aux[0].number + 1, nick[0].nick, "Excelente pregunta"],
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
                            });
                    });
            }
        });
    }

    getVotes(idQuestion, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("Select sum(value) as sum from votequestion where IDQuestion = ? ",
                    [idQuestion],
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

    //presionas sobre un tag
    searchByTag(tag, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.release();
                connection.query("SELECT q.id,q.title, q.text, q.date, u.icon, t.tag, u.nick from question q join users u on u.nick=q.nick left join tags t on t.idQuestion=q.id  where q.id in (SELECT IDquestion from tags where tag = ? ) order by q.date desc;",
                    [tag],
                    function (err, rows) {
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos join"), null);
                        }
                        else {
                            let list = [];
                            let title = "";
                            let cont = 0;
                            for (var i = 0; i < rows.length; i++) {
                                if (rows[i].title != title) {//no esta 

                                    let array = {
                                        id: "",
                                        title: "",
                                        text: "",
                                        date: "",
                                        nick: "",
                                        icon: "",
                                        tags: [],
                                    };

                                    title = rows[i].title;
                                    array.title = rows[i].title;
                                    array.text = rows[i].text;
                                    array.date = rows[i].date;
                                    array.id = rows[i].id;
                                    array.nick = rows[i].nick;
                                    array.icon = rows[i].icon;
                                    array.tags.push(rows[i].tag);
                                    list[cont] = array;
                                    cont++;
                                }
                                else {
                                    list[cont - 1].tags.push(rows[i].tag);
                                }
                            }
                            callback(null, list);
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
                connection.query("SELECT q.title, q.text, q.date, u.icon, t.tag, u.nick from question q join users u on u.nick=q.nick left join tags t on t.idQuestion=q.id where ( q.title LIKE ? ) or ( q.text LIKE ? ) order by q.date desc;",
                    ["%" + text + "%", "%" + text + "%"],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"), null);
                        }
                        else {
                            let list = [];
                            let title = "";
                            let cont = 0;
                            for (var i = 0; i < rows.length; i++) {
                                if (rows[i].title != title) {//no esta 

                                    let array = {
                                        id: "",
                                        title: "",
                                        text: "",
                                        date: "",
                                        nick: "",
                                        icon: "",
                                        tags: [],
                                    };

                                    title = rows[i].title;
                                    array.title = rows[i].title;
                                    array.text = rows[i].text;
                                    array.date = rows[i].date;
                                    array.id = rows[i].id;
                                    array.nick = rows[i].nick;
                                    array.icon = rows[i].icon;
                                    array.tags.push(rows[i].tag);
                                    list[cont] = array;
                                    cont++;
                                }
                                else {
                                    list[cont - 1].tags.push(rows[i].tag);
                                }
                            }
                            if (rows.length == 0) list = null;
                            callback(null, list);
                        }
                    });
            }
        });
    }

}
module.exports = DAOQuestion;