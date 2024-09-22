<?php

namespace FontSystem\Manager;
use FontSystem\Model\Database;

class FontUploader implements FontUploaderInterface
{
    private $uploadDir;
    private $conn;

    public function __construct($uploadDir = 'uploads/')
    {
        $this->uploadDir = $uploadDir;
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function upload($file): array
    {
        $fileType = mime_content_type($file['tmp_name']);

        if ($fileType == 'font/ttf' || $fileType == 'font/sfnt') {
            $uploadFile = $this->uploadDir . basename($file['name']);

            if (!file_exists('uploads')) {
                mkdir('uploads', 0777, true);
            }

            if (move_uploaded_file($file['tmp_name'], $uploadFile)) {
                $fontName = pathinfo($file['name'], PATHINFO_FILENAME);

                // Save font information to the database
                $query = "INSERT INTO fonts (font_name, file_name) VALUES (:font_name, :file_name)";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':font_name', $fontName);
                $stmt->bindParam(':file_name', $file['name']);
                $stmt->execute();

                return ["status" => "success", "message" => "Font uploaded successfully"];
            } else {
                return ["status" => "error", "message" => "Failed to upload file"];
            }
        } else {
            return ["status" => "error", "message" => "Only TTF files are allowed"];
        }
    }
}
