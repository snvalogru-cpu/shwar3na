<?php
include "config.php";

$data = json_decode(file_get_contents("php://input"), true);

$role = $data["role"];

$stmt = $conn->prepare("DELETE FROM institutions WHERE role = ?");
$stmt->bind_param("s", $role);

if ($stmt->execute()) {
  echo json_encode(["status" => "success"]);
} else {
  echo json_encode(["status" => "error"]);
}
?>