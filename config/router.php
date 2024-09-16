<?php
// router.php

require_once __DIR__ . '/database.php';
require_once __DIR__ . '/../app/controllers/TaskController.php';

header('Content-Type: application/json');

// Debug: Print the raw output for troubleshooting
ob_start(); // Start output buffering

$url = isset($_GET['url']) ? $_GET['url'] : '';
$method = $_SERVER['REQUEST_METHOD'];

switch ($url) {
    case 'task/create':
        if ($method === 'POST') {
            $taskController = new TaskController();
            $input = json_decode(file_get_contents('php://input'), true);
            if (isset($input['name'])) {
                $taskController->createTask($input['name']);
            } else {
                echo json_encode(['success' => false, 'error' => 'No name provided']);
            }
        } else {
            echo json_encode(['success' => false, 'error' => 'Invalid request method']);
        }
        break;
    default:
        echo json_encode(['success' => false, 'error' => 'Not found']);
        break;
}

$content = ob_get_clean(); // Get the content of the buffer and clean it
file_put_contents('debug_output.txt', $content); // Save to a file for inspection

?>
