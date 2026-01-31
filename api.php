<?php
/**
 * Shibganj Islamic Academy - API Bridge
 * This file handles server-side storage for the school management system.
 */

// Basic Security & Headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle Preflight Requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dbFile = 'sia_db.json';

// Handle Data Loading (GET)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($dbFile)) {
        $data = file_get_contents($dbFile);
        if (empty($data)) {
            echo json_encode(['status' => 'empty', 'message' => 'Database is empty']);
        } else {
            echo $data;
        }
    } else {
        // Create an empty DB file if it doesn't exist
        $initialData = json_encode(['status' => 'new', 'message' => 'No data on server yet']);
        file_put_contents($dbFile, $initialData);
        echo $initialData;
    }
    exit;
}

// Handle Data Saving (POST)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');
    
    // Validate if it's actual JSON
    json_decode($json);
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON data received']);
        exit;
    }

    if ($json) {
        if (file_put_contents($dbFile, $json)) {
            echo json_encode(['success' => true, 'timestamp' => time()]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Permission denied: Could not write to server file. Please check folder permissions.']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'No data sent to server']);
    }
    exit;
}
?>