<?php
namespace FontSystem\Manager;

use FontSystem\Model\Database;
use PDO;

class FontGroupManager implements FontGroupManagerInterface
{
    private $conn;

    public function __construct()
    {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function createGroup(string $groupName, array $fontGroupData): array
    {
        if (empty($fontGroupData)) {
            return ["status" => "error", "message" => "At least one font must be selected"];
        }

        try {
            // Insert the group into font_groups
            $query = "INSERT INTO font_groups (group_name) VALUES (:group_name)";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':group_name', $groupName);
            $stmt->execute();
            $groupId = $this->conn->lastInsertId();

            // Insert the font group details (font_id and font_title) into font_group_fonts
            foreach ($fontGroupData as $fontItem) {
                $query = "INSERT INTO font_group_fonts (group_id, font_id, font_title) VALUES (:group_id, :font_id, :font_title)";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':group_id', $groupId);
                $stmt->bindParam(':font_id', $fontItem['font']);
                $stmt->bindParam(':font_title', $fontItem['fontTitle']);
                $stmt->execute();
            }

            return ["status" => "success", "message" => "Font group created successfully"];
        } catch (\Exception $e) {
            return ["status" => "error", "message" => $e->getMessage()];
        }
    }

    public function updateGroup($groupId, $groupName, $fontGroupData): array {
        try {
            // Begin transaction
            $this->conn->beginTransaction();
    
            // Update the group name
            $query = "UPDATE font_groups SET group_name = :group_name WHERE id = :group_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':group_name', $groupName);
            $stmt->bindParam(':group_id', $groupId);
            $stmt->execute();
    
            // Fetch existing font associations for the group
            $query = "SELECT font_id, font_title FROM font_group_fonts WHERE group_id = :group_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':group_id', $groupId);
            $stmt->execute();
            $existingAssociations = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
            // Create an associative array for easier comparison
            $existingFonts = [];
            foreach ($existingAssociations as $assoc) {
                $existingFonts[$assoc['font_id']] = $assoc['font_title'];
            }
    
            // Fonts that are present in the new data but not in the existing group
            foreach ($fontGroupData as $fontItem) {
                $fontId = $fontItem['font'];
                $fontTitle = $fontItem['fontTitle'];
    
                // Check if the font already exists in the group
                if (isset($existingFonts[$fontId])) {
                    // If font exists but the title has changed, update the title
                    if ($existingFonts[$fontId] !== $fontTitle) {
                        $query = "UPDATE font_group_fonts SET font_title = :font_title WHERE group_id = :group_id AND font_id = :font_id";
                        $stmt = $this->conn->prepare($query);
                        $stmt->bindParam(':font_title', $fontTitle);
                        $stmt->bindParam(':group_id', $groupId);
                        $stmt->bindParam(':font_id', $fontId);
                        $stmt->execute();
                    }
    
                    // Remove from the existingFonts array to track which fonts should be deleted later
                    unset($existingFonts[$fontId]);
                } else {
                    // Add new font association
                    $query = "INSERT INTO font_group_fonts (group_id, font_id, font_title) VALUES (:group_id, :font_id, :font_title)";
                    $stmt = $this->conn->prepare($query);
                    $stmt->bindParam(':group_id', $groupId);
                    $stmt->bindParam(':font_id', $fontId);
                    $stmt->bindParam(':font_title', $fontTitle);
                    $stmt->execute();
                }
            }
    
            // Fonts that are in the existing group but not in the new data need to be removed
            if (!empty($existingFonts)) {
                $fontIdsToRemove = array_keys($existingFonts);
                $query = "DELETE FROM font_group_fonts WHERE group_id = :group_id AND font_id IN (" . implode(',', array_fill(0, count($fontIdsToRemove), '?')) . ")";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':group_id', $groupId);
                foreach ($fontIdsToRemove as $index => $fontId) {
                    $stmt->bindValue(($index + 1), $fontId, PDO::PARAM_INT);
                }
                $stmt->execute();
            }
    
            // Commit transaction
            $this->conn->commit();
    
            return ["status" => "success", "message" => "Font group updated successfully"];
        } catch (\Exception $e) {
            $this->conn->rollBack();
            return ["status" => "error", "message" => $e->getMessage()];
        }
    }
    

    public function getGroups(): array
    {
        try {
            // Modify query to get font count for each group
            $query = "
            SELECT fg.id, fg.group_name, COUNT(fgf.font_id) AS font_count, GROUP_CONCAT(fgf.font_title SEPARATOR ', ') as fonts
            FROM font_groups fg
            JOIN font_group_fonts fgf ON fg.id = fgf.group_id
            GROUP BY fg.id, fg.group_name
        ";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (\Exception $e) {
            return ["status" => "error", "message" => $e->getMessage()];
        }
    }


    public function deleteGroup(int $groupId): array
    {
        try {
            $query = "DELETE FROM font_groups WHERE id = :group_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':group_id', $groupId);
            $stmt->execute();

            return ["status" => "success", "message" => "Font group deleted successfully"];
        } catch (\Exception $e) {
            return ["status" => "error", "message" => $e->getMessage()];
        }
    }
}
