"use strict"
module.exports={
    /*Esta función devuelve un array con los textos de aquellas tareas de la lista de tareas tasks 
    que no estén finalizadas. */
     getToDoTasks(taskList) {
        let i = taskList.filter(v => (v.done==false || typeof(v.done) == 'undefined'));
        return i.map(v => v.text);
    },

    /*Esta función devuelve un array que contiene las tareas del array tasks que contengan, 
    en su lista de etiquetas, la etiqueta pasada como segundo parámetro.*/
     findByTag(taskList, tag) {
        return taskList.filter(v => v.tags.some(aux => aux==tag));
    },

    /*Esta función devuelve un array que contiene aquellas tareas del array tasks que contengan 
    al menos una etiqueta que coincida con una de las del array tags pasado como segundo parámetro.*/
     findByTags(taskList, tagsBuscados) {
        return taskList.filter(v => v.tags.some(aux => tagsBuscados.some(a => aux==a)));
    },

    /*Esta función devuelve el número de tareas completadas en el array de tareas tasks pasado como parámetro. */
     countDone(taskList) {
        let i = taskList.filter(v => v.done==true);
        return i.length;
    },

    /*Esta función recibe un texto intercalado con etiquetas, cada una de ellas formada 
    por una serie de caracteres alfanuméricos precedidos por el signo @. 
    Esta función debe devolver un objeto tarea con su array de etiquetas extraídas de la cadena texto. 
    Por otra parte, el atributo text de la tarea resultante no debe contener las etiquetas de 
    la cadena de entrada ni espacios en blanco de más. */
    createTask(texto) {
        let task = {
            text: "",
            done: false,
            tags: [],
        };
        let textoBruto = texto.split(" ");
        task.tags = textoBruto.filter(v => v.startsWith("@") == true);
        task.tags=task.tags.map(v => v.substr(1));
        task.text = textoBruto.filter(v => v.startsWith("@") == false).join(" ");

        return task;
    }


}