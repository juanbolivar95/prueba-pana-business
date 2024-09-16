<?php

require_once '../models/Task.php';

class TaskController
{
    private $model;

    public function __construct()
    {
        $this->model = new Task();
    }

    public function listTask()
    {
        $tasks = $this->model->index();
        echo json_encode(['tasks' => $tasks]);
    }

    public function listStates()
    {
        $states = $this->model->listStates();
        echo json_encode(['states' => $states]);
    }

    public function createTask($data)
    {
        $result = $this->model->create([
            'name' => $data['name'],
            'creation_date' => date('Y-m-d H:i:s'),
            'state_id' => 1
        ]);

        if ($result) {
            echo json_encode(['status' => 'success', 'message' => 'Tarea creada con éxito']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error al guardar la tarea.']);
        }
    }

    public function updateTask($data)
    {
        $result = $this->model->update([
            'id' => $data['id'],
            'state_id' => $data['state_id']
        ]);

        if ($result) {
            echo json_encode(['status' => 'success', 'message' => 'Estado actualizado con éxito']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error al actualizar el estado']);
        }
    }

    public function deleteTask($id)
    {
        $result = $this->model->delete($id);

        if ($result) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error']);
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $controller = new TaskController();

    if (isset($_POST['action']) && $_POST['action'] === 'delete') {
        $controller->deleteTask($_POST['id']);
    } elseif (isset($_POST['id']) && !empty($_POST['id'])) {
        $controller->updateTask($_POST);
    } else {
        $controller->createTask($_POST);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {

    if (isset($_GET['action'])) {

        $controller = new TaskController();

        if ($_GET['action'] === 'listTask') {
            $controller->listTask();
        } elseif ($_GET['action'] === 'listStates') {
            $controller->listStates();
        }
    }
}
