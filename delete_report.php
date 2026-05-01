<?php
include "config.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"];

$stmt = $conn->prepare("DELETE FROM reports WHERE id = ?");
$stmt->bind_param("i", $id);

echo json_encode([
  "status" => $stmt->execute() ? "success" : "error"
]);
?>