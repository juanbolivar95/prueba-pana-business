<?php

require_once __DIR__ . '/../../config/database.php';

class Task
{
    private $pdo;

    public function __construct()
    {
        $this->pdo = (new Database())->getConnection();
    }

    public function index()
    {
        $sql = "SELECT tasks.*, states.name AS state_name 
            FROM tasks 
            JOIN states ON tasks.state_id = states.id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function listStates()
    {
        $sql = "SELECT * FROM states";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    public function create($data)
{
    try {
        $stmt = $this->pdo->prepare('INSERT INTO tasks (name, creation_date, state_id) VALUES (?, ?, ?)');
        $stmt->execute([$data['name'], $data['creation_date'], $data['state_id']]);
        return true;
    } catch (PDOException $e) {
        return false;
    }
}


    public function update($request)
    {
        try {
            $stmt = $this->pdo->prepare('UPDATE tasks SET state_id = ? WHERE id = ?');
            $stmt->execute([$request['state_id'], $request['id']]);
            return true;
        } catch (PDOException $e) {
            return false;
        }
    }

    public function delete($id)
    {
        try {
            $stmt = $this->pdo->prepare('DELETE FROM tasks WHERE id = ?');
            return $stmt->execute([$id]);
        } catch (PDOException $e) {
            return false;
        }
    }
}
