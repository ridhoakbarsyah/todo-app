<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

include 'db.php'; // Ensure this file connects to your database

// Handle POST request to add a new task
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    // Assuming your table has a 'text' column for the task description
    $text = $data['text'];

    // Check for valid data
    if (!empty($text)) {
        $stmt = $conn->prepare("INSERT INTO tasks (text) VALUES (?)");
        $stmt->bind_param("s", $text); // 's' indicates the type is string
        $stmt->execute();

        // Get the last inserted ID
        $lastId = $stmt->insert_id;
        $stmt->close();

        // Return the new task as a JSON response
        echo json_encode(['id' => $lastId, 'text' => $text, 'completed' => false]);
    } else {
        http_response_code(400); // Bad Request
        echo json_encode(['error' => 'Task text is required']);
    }
}
