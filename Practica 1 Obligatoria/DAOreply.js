"use strict";

class DAOReply {

    constructor(pool){
        this.pool=pool;
    }

    getAllReplys(idQuestion,callback) {
        
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT u.icon, r.nick, r.votes, r.text, r.date from reply r join user u on r.nick=u.nick where r.idQuestion = ? order by r.ID;" ,
                [idQuestion],
                function(err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"),null);
                    }
                    else {
                        let list=[];
                        for (var i = 0; i < rows.length; i++) {
                                let  array={
                                    nick:"",
                                    icon:"",
                                    date:"",
                                    votes:"",
                                    text:"",
                                };

                                
                                array.nick=rows[i].nick;
                                array.icon=rows[i].icon;
                                array.date=rows[i].date;
                                array.votes=rows[i].votes;
                                array.text=rows[i].text;
                                list.push(array);
                        }  
                        callback(null,list);
                    }
                });
            }
        });     


    }

    voteReply(nick, voto, idReply, callback){
this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("INSERT INTO votereply (Nick, IDreply, value)  VALUES (?,?,?)",
                [nick, idReply, voto],
                function(err) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    callback(null);
                });  
            }
        });  
    }
    getVotes(idReply,callback)
    {
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("Select value from votereply where idReply = ? ",
                [idReply],
                function(err) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else{

                        let votostotales=0;
                        for(var i=0;i<rows.length;i++)
                        {
                            votostotales+=rows[i];
                        }
                        callback(null,votostotales);
                    }
                });  
            }
        });  
    }


    createReply(idQuestion,text,nick)
    {
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                //creamos la reply
                var f = new Date();
                let fecha = (f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear());
                connection.query("INSERT INTO reply (nick, idQuestion, text, date)  VALUES (?,?,?,?)",
                [nick, idQuestion, text, fecha],
                function(err) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else
                    {   //actualizamos los stats del usuario
                        connection.query("Select nAnswers from stats where nick = ? ",
                        [nick],
                        function(err) {
                            connection.release(); // devolver al pool la conexión
                            if (err) {
                                callback(new Error("Error de acceso a la base de datos"));
                            }
                            else{

                                let votostotales= rows[0] + 1;
                                connection.query("UPDATE stats set nAnswers = ? where nick = ? ",
                                [votostotales,nick],
                                function(err) {
                                    connection.release(); // devolver al pool la conexión
                                    if (err) {
                                        callback(new Error("Error de acceso a la base de datos"));
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