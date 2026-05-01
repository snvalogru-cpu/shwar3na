<?php
include "config.php";

$result = $conn->query("SELECT * FROM reports ORDER BY id DESC");

$reports = [];

while ($row = $result->fetch_assoc()) {
    $reports[] = [
        "id" => (int)$row["id"],
        "citizenName" => $row["citizen_name"],
        "citizenPhone" => $row["citizen_phone"],
        "citizenEmail" => $row["citizen_email"],
        "title" => $row["title"],
        "category" => $row["category"],
        "priority" => $row["priority"],
        "desc" => $row["description"],
        "gps" => $row["gps"],
        "image" => $row["image"],
        "authority" => $row["authority"],
        "authorityRole" => $row["authority_role"],
        "status" => $row["status"],
        "institutionNote" => $row["institution_note"],
        "createdAt" => $row["created_at"],
        "updatedAt" => $row["updated_at"]
    ];
}

header("Content-Type: application/json; charset=UTF-8");
echo json_encode($reports, JSON_UNESCAPED_UNICODE);
?>