<?php
$fontFile = isset($_GET['file']) ? $_GET['file'] : null;

if ($fontFile && file_exists(__DIR__ . '/uploads/' . $fontFile)) {
    header('Access-Control-Allow-Origin: *');  // Enable CORS
    header('Content-Type: font/ttf');  // Modify this based on the actual font type (e.g., font/woff2)
    readfile(__DIR__ . '/uploads/' . $fontFile);
    exit;
} else {
    http_response_code(404);
    echo "Font not found.";
}
?>
