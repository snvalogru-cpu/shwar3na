<?php
include "config.php";

$result = $conn->query("SELECT * FROM institutions ORDER BY id ASC");

$data = [];

while ($row = $result->fetch_assoc()) {
  $data[] = [
    "role" => $row["role"],
    "name" => $row["name"],
    "category" => $row["category"],
    "password" => $row["password"],
    "logo" => $row["logo"]
  ];
}

header("Content-Type: application/json; charset=UTF-8");
echo json_encode($data, JSON_UNESCAPED_UNICODE);
?>