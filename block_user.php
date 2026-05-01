<?php
include "config.php";

$data = json_decode(file_get_contents("php://input"), true);

$phone = $data["phone"];

$stmt = $conn->prepare("INSERT IGNORE INTO blocked_users (phone) VALUES (?)");
$stmt->bind_param("s", $phone);

echo json_encode([
  "status" => $stmt->execute() ? "success" : "error"
]);
?>