<?php
include "config.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"];
$note = $data["note"];
$updatedAt = $data["updatedAt"];

$stmt = $conn->prepare("UPDATE reports SET institution_note = ?, updated_at = ? WHERE id = ?");
$stmt->bind_param("ssi", $note, $updatedAt, $id);

echo json_encode([
  "status" => $stmt->execute() ? "success" : "error"
]);
?>