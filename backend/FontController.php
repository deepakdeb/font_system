<?php

require_once 'FontUploader.php';
require_once 'FontGroupManager.php';

class FontController
{
    private $uploader;
    private $fontGroupManager;
    private $conn;

    public function __construct(FontUploaderInterface $uploader, FontGroupManagerInterface $fontGroupManager)
    {
        $this->uploader = $uploader;
        $this->fontGroupManager = $fontGroupManager;
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function uploadFont($file)
    {
        return $this->uploader->upload($file);
    }

    public function createFontGroup($groupName, $fontGroupData)
    {
        // Backend validation for group name and font selection
        if (empty($groupName)) {
            return ["status" => "error", "message" => "Group name is required."];
        }

        // Ensure at least two fonts are selected with titles
        if (count($fontGroupData) < 2) {
            return ["status" => "error", "message" => "At least two fonts must be selected and have titles."];
        }

        // Ensure no duplicate fonts are added to the group
        $fontIds = array_column($fontGroupData, 'font');
        if (count($fontIds) !== count(array_unique($fontIds))) {
            return ["status" => "error", "message" => "Each font can only be added once per group."];
        }

        // Ensure each font has a valid ID and title
        foreach ($fontGroupData as $fontItem) {
            if (empty($fontItem['font']) || empty($fontItem['fontTitle'])) {
                return ["status" => "error", "message" => "Each font must have a valid selection and title."];
            }
        }

        // Proceed with creating the group if validation passes
        return $this->fontGroupManager->createGroup($groupName, $fontGroupData);
    }

    public function getFontGroups()
    {
        return $this->fontGroupManager->getGroups();
    }

    public function deleteFontGroup($groupId)
    {
        return $this->fontGroupManager->deleteGroup($groupId);
    }

    // Add this method to fetch all fonts
    public function getUploadedFonts()
    {
        $query = "SELECT id, font_name, file_name FROM fonts";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Add method to delete a font
    public function deleteFont($fontId)
    {
        $query = "DELETE FROM fonts WHERE id = :font_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':font_id', $fontId);
        if ($stmt->execute()) {
            return ["status" => "success", "message" => "Font deleted successfully"];
        } else {
            return ["status" => "error", "message" => "Failed to delete font"];
        }
    }
}
