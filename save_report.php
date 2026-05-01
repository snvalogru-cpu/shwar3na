<?php
include "config.php";

$data = json_decode(file_get_contents("php://input"), true);

$sql = "INSERT INTO reports 
(id, citizen_name, citizen_phone, citizen_email, title, category, priority, description, gps, image, authority, authority_role, status, institution_note, created_at, updated_at)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "isssssssssssssss",
    $data["id"],
    $data["citizenName"],
    $data["citizenPhone"],
    $data["citizenEmail"],
    $data["title"],
    $data["category"],
    $data["priority"],
    $data["desc"],
    $data["gps"],
    $data["image"],
    $data["authority"],
    $data["authorityRole"],
    $data["status"],
    $data["institutionNote"],
    $data["createdAt"],
    $data["updatedAt"]
);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error"]);
}
?>