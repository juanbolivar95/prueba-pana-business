let url = window.location.href;

document.getElementById('taskForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const taskName = document.getElementById('taskName').value;

    create(taskName);
});

const create = (taskName) => {
    const taskForm = document.getElementById('taskForm');
    fetch(`${url}app/controllers/TaskController.php`, {
        method: 'POST',
        body: new URLSearchParams({
            action: 'create',
            name: taskName
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            if (data.status === 'success') {
                Swal.fire({
                    icon: "success",
                    title: "Se creó",
                    text: "Su tarea se creó con éxito",
                    timer: 1500
                });
                taskForm.reset();
                loadTasks();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops....",
                    text: "Su tarea no se pudo crear",
                    timer: 1500
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

const loadTasks = () => {
    // console.log(`${url}app/controllers/TaskController.php?action=listTask`);

    fetch(`${url}app/controllers/TaskController.php?action=listTask`)
        .then(response => response.json())
        .then(data => {
            console.log(data.tasks);

            const taskList = document.getElementById('taskList');
            taskList.innerHTML = '';

            if (data.tasks.length > 0) {
                data.tasks.forEach(task => {
                    taskList.innerHTML += `
                        <tr>
                            <td>${task.id}</td>
                            <td>${task.name}</td>
                            <td>${task.creation_date}</td>
                            <td>
                                <select id="stateSelect_${task.id}" class="form-select" aria-label="Seleccione un estado" onchange="updateTaskState(${task.id}, this.value)">
                                </select>
                            </td>
                            <td>
                                <a onclick="deleteTask(${task.id})" class="btn btn-danger btn-sm">
                                    <i class="fa-regular fa-trash-can"></i>
                                </a>
                            </td>
                        </tr>
                    `;
                    // console.log(task.state_id);

                    loadStates(task.id, task.state_id);
                });

            } else {
                taskList.innerHTML += `
                    <tr>
                        <td colspan="5">En estos momentos no hay datos para mostrar</td>
                    </tr>
                `;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

const updateTaskState = (id, state) => {
    fetch(`${url}app/controllers/TaskController.php`, {
        method: 'POST',
        body: new URLSearchParams({
            action: 'update',
            id: id,
            state_id: state
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then(response => response.json())
        .then(data => {
            // console.log(data);

            if (data.status === 'success') {
                Swal.fire({
                    icon: "success",
                    title: "Actualizado",
                    text: "El estado se actualizó con éxito",
                    timer: 1500
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops....",
                    text: data.message,
                    timer: 1500
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

const deleteTask = (taskId) => {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "Si eliminas la tarea no la podras recuperar",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarla",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`${url}app/controllers/TaskController.php`, {
                method: 'POST',
                body: new URLSearchParams({
                    action: 'delete',
                    id: taskId
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        Swal.fire("Eliminada!", "La tarea ha sido eliminada.", "success");
                        loadTasks();
                    } else {
                        Swal.fire("Error", "No se pudo eliminar la tarea.", "error");
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    });
};

const loadStates = (taskId, selectedStateId) => {
    fetch(`${url}app/controllers/TaskController.php?action=listStates`)
        .then(response => response.json())
        .then(data => {
            if (data.states) {
                const stateSelect = document.getElementById(`stateSelect_${taskId}`);
                stateSelect.innerHTML = '';
                data.states.forEach(state => {
                    const option = document.createElement('option');
                    option.value = state.id;
                    option.textContent = state.name;

                    if (state.id == selectedStateId) {
                        option.selected = true;
                    }
                    stateSelect.appendChild(option);
                });
            } else {
                console.error('No se pudieron cargar los estados');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


window.onload = function () {
    loadTasks();
    // loadStates();
};
