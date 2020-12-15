"use strict";

class DAOQuestion {

    constructor(pool){
        this.pool=pool;
    }

    getQuestion(id, callback){
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT q.title, q.text, q.date, u.img,t.tag u.nick,v.value from question q join votequestion on q.id=v.IDQuestion join user u join tag on t.idQuestion=q.id order where q.id= ?" ,
                [id],
                function(err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"),null);
                    }
                    else {
                        let list=[];
                        let title="";
                        let cont=0;
                        for (var i = 0; i < rows.length; i++) {
                            if(rows[i].tittle != tittle){//no esta 
                                
                                let  array={
                                    title:"",
                                    text:"",
                                    date:"",
                                    nick:"",
                                    img:"",
                                    tags:[],
                                };

                                title=rows[i].title;
                                array.title=rows[i].title;
                                array.text=rows[i].text;
                                array.date=rows[i].date;
                                array.nick=rows[i].nick;
                                array.img=rows[i].img;
                                array.tags.push(rows[i].tag);
                                list[cont]=array;
                                cont++;
                            }
                            else{
                                list[cont-1].tags.push(rows[i].tag);
                            }
                        }  
                        callback(null,list);
                    }
                });
            }
        });     
    } 

    getAllQuestions(callback){
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT q.title, q.text, q.date, u.img,t.tag u.nick from question q join user u join tag on t.idQuestion=q.id order by q.title;" ,
                function(err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"),null);
                    }
                    else {
                        let list=[];
                        let title="";
                        let cont=0;
                        for (var i = 0; i < rows.length; i++) {
                            if(rows[i].title != title){//no esta 
                                
                                let  array={
                                    title:"",
                                    text:"",
                                    date:"",
                                    nick:"",
                                    img:"",
                                    tags:[],
                                };

                                title=rows[i].title;
                                array.title=rows[i].title;
                                array.text=rows[i].text;
                                array.date=rows[i].date;
                                array.nick=rows[i].nick;
                                array.img=rows[i].img;
                                array.tags.push(rows[i].tag);
                                list[cont]=array;
                                cont++;
                            }
                            else{
                                list[cont-1].tags.push(rows[i].tag);
                            }
                        }  
                        callback(null,list);
                    }
                });
            }
        });     
    } 
    //TODO actualizar los stats del usuario
    createQuestion(q, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("insert into question values ?" ,
                [q.nick, q.title, q.text, q.nVisit, q.date],
                function(err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if (rows.length === 0) {
                            callback(new Error("error al insertar la pregunta en la base de datos")); 
                        }
                        else {
                            connection.query("insert into votequestion values ?" ,
                            [rows[0].id,0],
                            function(err, rows2) {
                                connection.release(); // devolver al pool la conexión
                                if (err) {
                                    callback(new Error("Error de acceso a la base de datos"));
                                }
                                else {
                                    if (rows2.length === 0) {
                                        callback(new Error("error al insertar la pregunta en la base de datos")); 
                                    }
                                    else {
                                        
                                        callback(null);
                                    }           
                                }
                            });
                            
                            callback(null);
                        }           
                    }
                });
            }
        });     
    }

    doAVisit(idUser,idQuestion,callback){
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("insert into visit values ?" ,
                [idUser,idQuestion],
                function(err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        console.log(err);
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if (rows.length === 0) {
                            callback(null);
                        }
                        else {
                           
                            callback(null);
                        }           
                    }
                });
            }
        });    
    }

    getQuestionWithoutReply(){
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT q.title, q.text, q.date, u.img,t.tag u.nick from question q join user u join tag on t.idQuestion=q.id left join reply on r.idQuestion=q.id where r.idQuestion is NULL order by q.title;" ,
                function(err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"),null);
                    }
                    else {
                        let list=[];
                        let title="";
                        let cont=0;
                        for (var i = 0; i < rows.length; i++) {
                            if(rows[i].title != title){//no esta 
                                
                                let  array={
                                    title:"",
                                    text:"",
                                    date:"",
                                    nick:"",
                                    img:"",
                                    tags:[],
                                };

                                title=rows[i].title;
                                array.title=rows[i].title;
                                array.text=rows[i].text;
                                array.date=rows[i].date;
                                array.nick=rows[i].nick;
                                array.img=rows[i].img;
                                array.tags.push(rows[i].tag);
                                list[cont]=array;
                                cont++;
                            }
                            else{
                                list[cont-1].tags.push(rows[i].tag);
                            }
                        }  
                        callback(null,list);
                    }
                });
            }
        });     
    }

    //presionas sobre un tag
    searchByTag(tag)
    {
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT IDquestion from tags where tag = ?" ,
                [tag],
                function(err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        console.log(err);
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        //TODO en esta parte los rows que devuelve la select anterior es un array, hay que ver como gestionar esto con la siguiente select
                        connection.query("SELECT q.title, q.text, q.date, u.img,t.tag u.nick from question q join user u join tag on t.idQuestion=q.id left join reply on r.idQuestion=q.id where r.idQuestion = ? is NULL order by q.title;" ,
                        [rows], //rows es un array wtf??¿?
                        function(err, rows) {
                            connection.release(); // devolver al pool la conexión
                            if (err) {
                                callback(new Error("Error de acceso a la base de datos"),null);
                            }
                            else {
                                let list=[];
                                let title="";
                                let cont=0;
                                for (var i = 0; i < rows.length; i++) {
                                    if(rows[i].title != title){//no esta 
                                        
                                        let  array={
                                            title:"",
                                            text:"",
                                            date:"",
                                            nick:"",
                                            img:"",
                                            tags:[],
                                        };
        
                                        title=rows[i].title;
                                        array.title=rows[i].title;
                                        array.text=rows[i].text;
                                        array.date=rows[i].date;
                                        array.nick=rows[i].nick;
                                        array.img=rows[i].img;
                                        array.tags.push(rows[i].tag);
                                        list[cont]=array;
                                        cont++;
                                    }
                                    else{
                                        list[cont-1].tags.push(rows[i].tag);
                                    }
                                }  
                                callback(null,list);
                            }
                        });
                    }
                });
            }
        });    
    }
    //TODO para buscar por la barra de navegacion, si pones parte de un titulo te tiene que salir la pregunta cuyo titulo contenga esas letras
    searchByTextBar(text){

    }

}
module.exports = DAOQuestion;