<?php
include "config.php";

$data = json_decode(file_get_contents("php://input"), true);
$phone = $data["phone"];

$stmt = $conn->prepare("DELETE FROM blocked_users WHERE phone = ?");
$stmt->bind_param("s", $phone);

if ($stmt->execute()) {
  echo json_encode(["status" => "success"]);
} else {
  echo json_encode(["status" => "error"]);
}
?>