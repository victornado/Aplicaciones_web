"use strict";

const { isNullOrUndefined } = require("util");

class DAOTasks {

    constructor(pool){
        this.pool=pool;
    }

    getAllTasks(email, callback){
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"),null);
            }
            else {
                connection.query("SELECT id,user,text,tag,done FROM task t left join tag g on t.id=g.taskId WHERE t.user = ?" ,
                [email],
                function(err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"),null);
                    }
                    else {
                        if (rows.length === 0) {// ese usuario no ha realizado ni empezado ninguna tarea
                            callback(new Error("el usuario no ha realizado ni empezado ninguna tarea"), null); 
                        }
                        else { //TODO
                            let list=[];

                            let id=-1;
                            let cont=0;
                            for (var i = 0; i < rows.length; i++) {
                                if(rows[i].id != id){//no esta 
                                    
                                    let  array={
                                        id:"",
                                        text:"",
                                        done:1,
                                        tags:[],
                                    };

                                    id=rows[i].id
                                    array.id=rows[i].id;
                                    array.text=rows[i].text;
                                    array.done=rows[i].done;
                                    if(array.done===undefined)
                                        array.done=0;
                                    array.tags.push(rows[i].tag);
                                    list[cont]=array;
                                    cont++;
                                }
                                else{
                                    list[cont-1].tags.push(rows[i].tag);
                                }
                            }
                            
                            callback(null, list);
                        }          
                    }
                });
            }
        });     
    }

    insertTask(email, task, callback){
        this.pool.getConnection(function(err, connection) {

            if (err) { 
                callback(new Error("Error de conexión a la base de datos"),null);
            }
            
            else {
                connection.query("INSERT INTO task (user, text, done) VALUES (?, ?, ?)" ,[email,task.text,task.done],
                function(err, row) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        console.log("error en task");
                        callback(new Error("Error de acceso a la base de datos"),null);
                    }
                    else {
                            //insertamos los tag
                            let tam=task.tags.length;
                            let myString="";
                            task.tags.map(v=> myString+="(?,?),");
                            myString = myString.substr(0,myString.length-1);
                            let values = [];

                            task.tags.map(v=>values.push([row.insertId,v]));
                            if(tam>0){
                                connection.query("INSERT INTO tag (taskId, tag) VALUES ?" , [values],
                                    function(err, sol) {
                                    // connection.release(); // devolver al pool la conexión
                                        if (err) {
                                            console.log("error en tag");
                                            callback(new Error("Error de acceso a la base de datos"),null);
                                        }
                                    }
                                );
                            }
                                //fin de insertar TAG

                            callback(null, row);           
                    }
                });
            }

        });     
    } 
    

    markTaskDone(idTask, callback){
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("update task set done= true where id=?;" ,
                [idTask],
                function(err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if (rows.length === 0) {
                            callback(isNullOrUndefined); //no esta el usuario
                        }
                        else {
                            callback(null);
                        }           
                    }
                });
            }
        });     
    }

    deleteCompleted(email, callback){
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("delete from task where user = ? AND done = 1;" ,
                [email],//borra en cascada los tag
                function(err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        console.log(err);
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        callback(null);        
                    }
                });
            }
        });     
    }

}
module.exports = DAOTasks;