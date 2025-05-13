/* 1. ESPERAR A QUE EL DOM SE CARGUE. Espera a que el HTML esté completamente cargado antes de ejecutar cualquier código
de JavaScript. DOM: Document Object Model, o lo que es lo mismo, la estructura de un documento.
 */
document.addEventListener("DOMContentLoaded", () => {
  /* 2. CAPTURAR ELEMENTOS DEL DOM. Guardar en variables los elementos que necesitamos. */
  const taskInput = document.getElementById("elemento"); //Campo donde se escribe la tarea
  const addTaskBtn = document.getElementById("addBtn"); //Botón para añadir
  const taskList = document.getElementById("taskList"); //La lista donde se mostrarán las tareas
  const clearAllBtn = document.getElementById("clearAllBtn"); //Botón para borrar todas las tareas
  const sortable = new Sortable(taskList, {
    animation: 150, // Animación suave al mover elementos
    ghostClass: "sortable-ghost", // Clase para resaltar el elemento que se mueve
    onEnd: saveTasks, // Guarda el nuevo orden en localStorage
  }); //Para poder reordenar las tareas

  /* 3. CARGAR TAREAS GUARDADAS: Llama a la función loadTasks(), que recupera las tareas almacenadas en localStorage 
y las muestra en pantalla.*/
  loadTasks();

  /* 4. AGREGAR EVENTOS al botón y al campo de texto. Cuando el usuario hace clic en el botón "Agregar", 
  se ejecuta la función addTask(). También permite que al presionar Enter, se agregue la tarea sin necesidad 
  de hacer clic en el botón.*/
  addTaskBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTask();
  });

  /* 5. FUNCIÓN PARA AGREGAR UNA TAREA. Obtiene el texto ingresado en el campo de texto, se usa .trim() para eliminar 
  espacios en blanco al inicio y al final.*/
  function addTask() {
    const taskText = taskInput.value.trim();
    // Si el campo está vacío (""), la función se detiene (return).
    if (taskText === "") return;

    // Creamos un elemento lista donde se irán añadiendo las tareas
    const li = document.createElement("li");
    // Crea un nuevo elemento <li> en la lista e inserta dentro un <span> con el texto de la tarea y un botón "X" para eliminarla.
    li.innerHTML = `
    <img class="img1" src="Media/Play.png"/>
    <span>${taskText}</span>
    <button class="delete-btn"><img class="img1" src="Media/xmark.png"/></button>
    `;

    // Al hacer click en el texto se marca completada o no la tarea
    li.querySelector("span").addEventListener("click", () => {
      // Se alterna la clase "completed" en el elemento li. Si li ya tiene la clase "completed", se elimina. Sino, se agrega.
      li.classList.toggle("completed");
      /* Llama a la función saveTasks(), que guarda el estado de las tareas (por ejemplo, en localStorage para 
      que persistan tras recargar la página). */
      saveTasks();
    });

    // Cuando se hace clic en el botón "X", se elimina la tarea (li.remove()). Se llama a saveTasks() para actualizar localStorage.
    li.querySelector(".delete-btn").addEventListener("click", () => {
      li.remove();
      saveTasks();
    });

    // Agrega la nueva tarea a la lista. Limpia el campo de texto taskInput.value = "". Guarda la lista actualizada en localStorage.
    taskList.appendChild(li);
    taskInput.value = "";
    saveTasks();
  }

  /* 6. FUNCIÓN GUARDAR TAREAS EN EL LOCALSTORAGE: función saveTasks() */
  function saveTasks() {
    // Crea un array vacío tasks.
    const tasks = [];
    //  Recorre todas las tareas (<li>) en la lista y guarda en tasks: Texto de la tarea y si está completada o no
    // si tiene la clase completed o no (.contains("completed")).
    document.querySelectorAll("#taskList li").forEach((li) => {
      tasks.push({
        text: li.querySelector("span").textContent, // en lugar de li.firstChild.textContent
        completed: li.classList.contains("completed"),
      });
    });
    // Convierte el array tasks en texto JSON y lo guarda en localStorage.
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  /* 7. FUNCIÓN CARGAR TAREAS AL INICIAR: Obtiene las tareas guardadas en localStorage.
  Si no hay ninguna, usa un array vacío ([]) para evitar errores.  operador || [] es un operador lógico OR. 
  Si localStorage.getItem("tasks") devuelve null (por ejemplo, si no hay tareas guardadas), entonces se asigna
  un arreglo vacío [] como valor predeterminado.*/
  function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    //Recorre la lista de tareas guardadas (savedTasks). Crea un nuevo <li> por cada tarea. Si la tarea estaba completada, le añade la clase completed.
    //Usa destructuración de objetos para extraer directamente las propiedades text y completed de cada tarea en savedTasks
    savedTasks.forEach(({ text, completed }) => {
      const li = document.createElement("li");
      // Inserta el texto de la tarea dentro de un <span>. Añade un botón con la clase "delete-btn" para poder eliminar la tarea.
      li.innerHTML = `
          <img class="img1" src="Media/Play.png"/>
          <span>${text}</span>
          <button class="delete-btn"><img class="img1" src="Media/xmark.png"/></button>
      `;
      // Si la tarea estaba marcada como completada (completed === true), se le agrega la clase "completed" al <li>.
      if (completed) li.classList.add("completed");

      // Agrega los mismos eventos que la función addTask(): Clic en el texto: Marca o desmarca como completada. Clic en "X": Elimina la tarea.
      li.querySelector("span").addEventListener("click", () => {
        li.classList.toggle("completed");
        saveTasks();
      });

      li.querySelector(".delete-btn").addEventListener("click", () => {
        li.remove();
        saveTasks();
      });

      // Agrega la tarea a la lista (taskList).
      taskList.appendChild(li);
    });
  }

  clearAllBtn.addEventListener("click", () => {
    taskList.innerHTML = ""; // Borra todas las tareas de la pantalla
    localStorage.removeItem("tasks"); // Borra las tareas del almacenamiento
  });
});
