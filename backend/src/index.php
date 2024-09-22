<?php

error_reporting(E_ALL);
ini_set('display_errors', '1');

require_once __DIR__ . '/../vendor/autoload.php';

use FontSystem\Controller\FontController;
use FontSystem\Manager\FontGroupManager;
use FontSystem\Manager\FontUploader;
use FontSystem\Model\Database;

// Allow CORS and handle preflight requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Read raw input for JSON data
$inputData = json_decode(file_get_contents('php://input'), true);

// Initialize services
$uploader = new FontUploader();
$fontGroupManager = new FontGroupManager();
$controller = new FontController($uploader, $fontGroupManager);

$database = new Database();

// Handle API requests
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['font'])) {
    echo json_encode($controller->uploadFont($_FILES['font']));
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($inputData['groupName']) && isset($inputData['fontGroupData'])) {
    // Handle adding a font group
    echo json_encode($controller->createFontGroup($inputData['groupName'], $inputData['fontGroupData']));
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'getGroups') {
    echo json_encode($controller->getFontGroups());
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'getFonts') {
    echo json_encode($controller->getUploadedFonts());
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($inputData['deleteGroup'])) {
    // Handle deleting a font group
    echo json_encode($controller->deleteFontGroup($inputData['deleteGroup']));
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($inputData['deleteFont'])) {
    // Handle deleting a font
    echo json_encode($controller->deleteFont($inputData['deleteFont']));
} else {
    http_response_code(404);
    echo json_encode(["message" => "Invalid API request"]);
}
