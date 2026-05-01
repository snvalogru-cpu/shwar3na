<?php
include "config.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"];
$status = $data["status"];
$updatedAt = $data["updatedAt"];

$stmt = $conn->prepare("UPDATE reports SET status = ?, updated_at = ? WHERE id = ?");
$stmt->bind_param("ssi", $status, $updatedAt, $id);

echo json_encode([
  "status" => $stmt->execute() ? "success" : "error"
]);
?>