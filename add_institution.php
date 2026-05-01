<?php
include "config.php";

$data = json_decode(file_get_contents("php://input"), true);

$name = $data["name"];
$category = $data["category"];
$role = $data["role"];
$password = $data["password"];
$logo = $data["logo"];

$stmt = $conn->prepare("INSERT INTO institutions (role, name, category, password, logo) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $role, $name, $category, $password, $logo);

if ($stmt->execute()) {
  echo json_encode(["status" => "success"]);
} else {
  echo json_encode(["status" => "error"]);
}
?>