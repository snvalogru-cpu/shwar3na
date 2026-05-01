<?php
header("Content-Type: application/json; charset=UTF-8");
include "config.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status" => "no_data"], JSON_UNESCAPED_UNICODE);
    exit;
}

$name = trim($data["name"] ?? "");
$phone = trim($data["phone"] ?? "");
$email = trim($data["email"] ?? "");
$passwordPlain = trim($data["password"] ?? "");

if ($name === "" || $phone === "" || $passwordPlain === "") {
    echo json_encode(["status" => "error", "message" => "بيانات ناقصة"], JSON_UNESCAPED_UNICODE);
    exit;
}

$check = $conn->prepare("SELECT id FROM users WHERE phone = ? LIMIT 1");

if (!$check) {
    echo json_encode(["status" => "error", "message" => $conn->error], JSON_UNESCAPED_UNICODE);
    exit;
}

$check->bind_param("s", $phone);
$check->execute();
$result = $check->get_result();

if ($result && $result->num_rows > 0) {
    echo json_encode(["status" => "exists", "message" => "رقم الهاتف مستخدم مسبقًا"], JSON_UNESCAPED_UNICODE);
    exit;
}

$hashedPassword = password_hash($passwordPlain, PASSWORD_BCRYPT, ["cost" => 12]);
$role = "citizen";

$stmt = $conn->prepare("INSERT INTO users (full_name, phone, email, password, role) VALUES (?, ?, ?, ?, ?)");

if (!$stmt) {
    echo json_encode(["status" => "error", "message" => $conn->error], JSON_UNESCAPED_UNICODE);
    exit;
}

$stmt->bind_param("sssss", $name, $phone, $email, $hashedPassword, $role);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error], JSON_UNESCAPED_UNICODE);
}

$conn->close();
?>