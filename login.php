<?php
header("Content-Type: application/json; charset=UTF-8");
include "config.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status" => "no_data"], JSON_UNESCAPED_UNICODE);
    exit;
}

$phone = trim($data["phone"] ?? "");
$passwordPlain = trim($data["password"] ?? "");

if (!$phone || !$passwordPlain) {
    echo json_encode(["status" => "error", "message" => "بيانات ناقصة"], JSON_UNESCAPED_UNICODE);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM users WHERE phone = ? LIMIT 1");
$stmt->bind_param("s", $phone);
$stmt->execute();

$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {

    if (password_verify($passwordPlain, $row["password"])) {

        if (password_needs_rehash($row["password"], PASSWORD_BCRYPT, ["cost" => 12])) {
            $newHash = password_hash($passwordPlain, PASSWORD_BCRYPT, ["cost" => 12]);

            $update = $conn->prepare("UPDATE users SET password = ? WHERE phone = ?");
            $update->bind_param("ss", $newHash, $phone);
            $update->execute();
        }

        echo json_encode([
            "status" => "success",
            "user" => [
                "full_name" => $row["full_name"],
                "phone" => $row["phone"],
                "email" => $row["email"],
                "role" => $row["role"]
            ]
        ], JSON_UNESCAPED_UNICODE);

    } else {
        echo json_encode(["status" => "error", "message" => "كلمة المرور غير صحيحة"], JSON_UNESCAPED_UNICODE);
    }

} else {
    echo json_encode(["status" => "error", "message" => "المستخدم غير موجود"], JSON_UNESCAPED_UNICODE);
}

$conn->close();
?>