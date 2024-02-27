document.addEventListener("DOMContentLoaded", function() {
    const taskInput = document.getElementById("taskInput");
    const addTaskButton = document.getElementById("addTaskButton");
    const taskList = document.getElementById("taskList");
    const downloadButton = document.getElementById("download");
    const clearButton = document.getElementById("clear");
    const importButton = document.getElementById("import");

    // loads tasks from the local storage
    loadTasks();

    addTaskButton.addEventListener("click", function() {
        const taskText = taskInput.value.trim();

        if (taskText != "") {
            addTask(taskText);
            taskInput.value = "";

            saveTasks(); // Save tasks after adding one
        } else {
            alert("Please enter a task.");
        }
    });

    downloadButton.addEventListener("click", function() {
        const tasks = JSON.parse(localStorage.getItem("tasks"));
        const JSONTasks = JSON.stringify(tasks);
        const blob = new Blob([JSONTasks], {type: "application/json"});

        // Create a link object and trigger a click event on the link element
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "tasks.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    clearButton.addEventListener("click",function() {
        if (confirm("Do you want to clear your list?")) {
            const taskElements = document.querySelectorAll("#taskList li");
            taskElements.forEach(function(taskElement) {
                taskElement.remove();
            });
            saveTasks();
        }
    });

    importButton.addEventListener("click", function() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        document.body.appendChild(fileInput);
        fileInput.click();
        fileInput.onchange = () => {
            const file = fileInput.files[0];
            if (file) {
                var reader = new FileReader();
                reader.readAsText(file, "UTF-8");
                reader.onload = function (evt) {
                    const taskElements = document.querySelectorAll("#taskList li");
                    taskElements.forEach(function(taskElement) {
                        taskElement.remove();
                    });
                    const tasks = JSON.parse(evt.target.result);
                    if (tasks) {
                        tasks.forEach(function(task) {
                            const taskText = task[0];
                            const isMarked = task[1];
                            addTask(taskText,isMarked);
                            saveTasks();
                        });
                    }
                }
                reader.onerror = function (evt) {
                    alert("Error while loading file");
                }
            }
        }
        document.body.removeChild(fileInput);
    });


    function saveTasks() {
        const tasks = [];
        const taskElements = document.querySelectorAll("#taskList li");
        taskElements.forEach(function(taskElement) {
            const text = taskElement.querySelector("div").textContent;
            const isMarked = taskElement.classList.contains("marked");
            tasks.push([text,isMarked]);
        });
        localStorage.setItem("tasks",JSON.stringify(tasks));
    }


    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks"));
        if (tasks) {
            tasks.forEach(function(task) {
                const taskText = task[0];
                const isMarked = task[1];
                addTask(taskText,isMarked);
            });
        }
    }

    function addTask(taskText,isMarked=false) {
        const li = document.createElement("li");
        
        const markButton = document.createElement("button");
        markButton.textContent = "Mark";
        markButton.classList.add("mark");
        markButton.addEventListener("click",function() {
            if (li.classList.contains("marked")) {
                li.classList.remove("marked");
                markButton.textContent = "Mark";
            } else {
                li.classList.add("marked");
                markButton.textContent = "Unmark";
            }
            saveTasks(); // Save the tasks after removing one
        });


        if (isMarked) {
            li.classList.add("marked");
            markButton.textContent = "Unmark";
        }

        const textBox = document.createElement("div");
        textBox.textContent = taskText;

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit");
        editButton.addEventListener("click",function() {
            const currentText = textBox.textContent.trim();
            const inputElement = document.createElement('input');
            inputElement.type = 'text';
            inputElement.value = currentText;
            textBox.innerHTML = '';
            textBox.appendChild(inputElement);
            inputElement.focus();
            editing = true;
            inputElement.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    const newText = inputElement.value;
                    textBox.textContent = newText;
                    editButton.textContent = "Edit";
                    saveTasks();
                }
            });
        });

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.classList.add("remove");
        removeButton.addEventListener("click",function() {
            li.remove();
            saveTasks(); // Save the tasks after removing one
        });

        li.appendChild(markButton);
        li.appendChild(textBox);
        li.appendChild(editButton);
        li.appendChild(removeButton);
        taskList.appendChild(li);
    }

});