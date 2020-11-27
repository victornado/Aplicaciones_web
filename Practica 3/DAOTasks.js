"use strict";

class DAOTasks {

    constructor(pool){
        this.pool=pool;
    }

    getAllTasks(email, callback){
        this.pool.getConnection(function(err, connection) {
            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT id,user,text,tag FROM task t join tag g on t.id=g.taskId WHERE t.user = ?" ,
                [email],
                function(err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if (rows.length === 0) {// ese usuario no ha realizado ni empezado ninguna tarea
                            callback(null, null); 
                        }
                        else { //TODO
                            let  array={
                                id:"",
                                text:"",
                                done:0,
                                tags:[],

                            };
                            let id=rows.map( v=> v.id);
                            
                            callback(null, array);
                        }          
                    }
                });
            }
        });     
    }

    insertTask(email, task, callback){
        this.pool.getConnection(function(err, connection) {

            if (err) { 
                callback(new Error("Error de conexión a la base de datos"));
            }
            
            else {
                connection.query("INSERT INTO task (user, text, done) VALUES (?, ?, ?)" ,[email,task.text,task.done],
                function(err, row) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        console.log(err);
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if (row.length === 0) {
                            callback(null, null); //no esta el usuario
                        }
                        else {

                            //insertamos los tag
                            let tam=task.tags.length;
                            let myString;
                            task.tags.map(v=> myString="(?,?),");
                            myString = myString.substr(0,myString.length-1);
                            let values = [];

                            task.tags.map(v=>values.push([row.insertId,v]));
                            connection.query("INSERT INTO tag (taskId, tag) VALUES ?" , values,
                                function(err, sol) {
                                   // connection.release(); // devolver al pool la conexión
                                    if (err) {
                                        console.log(err);
                                        callback(new Error("Error de acceso a la base de datos"));
                                    }
                                });
                                //fin de insertar TAG

                            callback(null, row);
                        }           
                    }
                });
            }

        });     
    } 
    

    markTaskDone(idTask, callback){
        return 0;
    }

    deleteCompleted(email, callback){

    }

}
module.exports = DAOTasks;