<?php
/**
 * Shibganj Islamic Academy - Professional API Bridge
 * Safe for Shared Hosting (cPanel)
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

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
            echo json_encode(['status' => 'empty', 'message' => 'DB initialized but empty']);
        } else {
            echo $data;
        }
    } else {
        $initialData = json_encode(['status' => 'new', 'message' => 'Please save data from admin dashboard first']);
        file_put_contents($dbFile, $initialData);
        echo $initialData;
    }
    exit;
}

// Handle Data Saving (POST)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');
    
    // Validate JSON
    if (!json_decode($json)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON data structure']);
        exit;
    }

    if ($json) {
        if (file_put_contents($dbFile, $json)) {
            echo json_encode(['success' => true, 'timestamp' => date('Y-m-d H:i:s')]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Storage permission error. Check folder permissions.']);
        }
    }
    exit;
}
?>