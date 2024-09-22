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
