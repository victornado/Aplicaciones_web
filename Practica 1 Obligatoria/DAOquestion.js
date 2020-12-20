"use strict";

class DAOQuestion {

    constructor(pool){
        this.pool=pool;
    }

    getQuestion(title, callback){
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT q.title, q.text, q.date, u.icon, t.tag, u.nick, v.value from tags t right join question q on t.idQuestion=q.id join users u on u.nick = q.nick left join votequestion v on q.id=v.IDQuestion where q.title= ?" ,
                [title],
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
                                    icon:"",
                                    tags:[],
                                    value:0
                                };

                                title=rows[i].title;
                                array.title=rows[i].title;
                                array.text=rows[i].text;
                                array.date=rows[i].date;
                                array.nick=rows[i].nick;
                                array.icon=rows[i].icon;
                                array.value=rows[i].value;
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
                connection.query("SELECT q.title, q.text, q.date, u.icon,t.tag, u.nick from question q join users u on u.nick = q.nick left join tags t on t.idQuestion=q.id order by q.title " ,
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
                                    icon:"",
                                    tags:[],
                                };

                                title=rows[i].title;
                                array.title=rows[i].title;
                                array.text=rows[i].text;
                                array.date=rows[i].date;
                                array.nick=rows[i].nick;
                                array.icon=rows[i].icon;
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
                var f = new Date();
                let fecha = (f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear());
                connection.query("insert into question (nick, title, text, nVisit, date) values (?,?,?,?,?)" ,
                [q.nick, q.title, q.text, 0, fecha],
                function(err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos en question"));
                    }
                    else {
                         //insertamos los tag
                         let tam=q.tags.length;
                         let myString="";
                         q.tags.map(v=> myString+="(?,?),");
                         myString = myString.substr(0,myString.length-1);
                         let values = [];
                         q.tags.map(v=>values.push([rows.insertId,v]));

                            connection.query("insert into tags (IDquestion, tag) values ?" ,
                            [values],
                            function(err, rows) {
                    
                            if (err) {
                                callback(new Error("Error de acceso a la base de datos en tags"));
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

    getID(title,callback){
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("select id from question where title= ?" ,
                [title],
                function(err, rows) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"),null);
                    }
                    else {
                        callback(null,rows[0].id);
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
                connection.query("insert into visit values (?,?)" ,
                [idUser,idQuestion],
                function(err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                       
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

    getQuestionWithoutReply(callback){
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT q.title, q.text, q.date, u.icon, t.tag, u.nick from question q join users u on u.nick=q.nick left join tags t on t.idQuestion=q.id left join reply r on r.idQuestion=q.id where r.idQuestion is NULL order by q.title;" ,
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
                                    icon:"",
                                    tags:[],
                                };

                                title=rows[i].title;
                                array.title=rows[i].title;
                                array.text=rows[i].text;
                                array.date=rows[i].date;
                                array.nick=rows[i].nick;
                                array.icon=rows[i].icon;
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
    searchByTag(tag,callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.release();
                connection.query("SELECT q.title, q.text, q.date, u.icon, t.tag, u.nick from question q join users u on u.nick=q.nick left join tags t on t.idQuestion=q.id  where q.id in (SELECT IDquestion from tags where tag = ? ) order by q.title;" ,
                [tag], 
                function(err, rows) {
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos join"),null);
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
                                    icon:"",
                                    tags:[],
                                };

                                title=rows[i].title;
                                array.title=rows[i].title;
                                array.text=rows[i].text;
                                array.date=rows[i].date;
                                array.nick=rows[i].nick;
                                array.icon=rows[i].icon;
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
    //El text que llega es un array de palabras
    searchByTextBar(text,callback){
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                let ret;
                for(let p=0;p<text.length;p++) {
                    connection.query("SELECT q.title, q.text, q.date, u.icon, t.tag, u.nick from question q join user u on u.nick=q.nick join tags t on t.idQuestion=q.id where CONTAINS( q.title , ? ) order by q.title;" ,
                    [text[p]],
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
                                        icon:"",
                                        tags:[],
                                    };

                                    title=rows[i].title;
                                    array.title=rows[i].title;
                                    array.text=rows[i].text;
                                    array.date=rows[i].date;
                                    array.nick=rows[i].nick;
                                    array.icon=rows[i].icon;
                                    array.tags.push(rows[i].tag);
                                    list[cont]=array;
                                    cont++;
                                }
                                else{
                                    list[cont-1].tags.push(rows[i].tag);
                                }
                            }  
                            ret[p]=list;
                        }
                    });
                }
                callback(null,ret);
            }
        });     
    }
}
module.exports = DAOQuestion;