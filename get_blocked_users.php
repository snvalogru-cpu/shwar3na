<?php
include "config.php";

$result = $conn->query("SELECT phone FROM blocked_users");

$users = [];

while ($row = $result->fetch_assoc()) {
  $users[] = $row["phone"];
}

header("Content-Type: application/json; charset=UTF-8");
echo json_encode($users, JSON_UNESCAPED_UNICODE);
?>