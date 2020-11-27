"use strict";

class DAOTask {

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
                        else {
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

    }

    markTaskDone(idTask, callback){

    }

    deleteCompleted(email, callback){

    }


}
module.exports = DAOTasks;