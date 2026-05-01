<?php
header("Content-Type: application/json; charset=UTF-8");

include "config.php";
include "send_mail.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"];
$status = $data["status"];
$updatedAt = $data["updatedAt"];

$stmt = $conn->prepare("UPDATE reports SET status = ?, updated_at = ? WHERE id = ?");
$stmt->bind_param("ssi", $status, $updatedAt, $id);

if ($stmt->execute()) {

    $get = $conn->prepare("SELECT citizen_email, title FROM reports WHERE id = ?");
    $get->bind_param("i", $id);
    $get->execute();

    $result = $get->get_result();

    if ($row = $result->fetch_assoc()) {
        $email = $row["citizen_email"];
        $title = $row["title"];

        if (!empty($email)) {
            $subject = "تحديث حالة بلاغك في نظام شوارعنا";

            $body = "
                <div dir='rtl' style='font-family:Arial; line-height:1.8'>
                    <h2>نظام شوارعنا</h2>
                    <p>تم تحديث حالة بلاغك:</p>
                    <p><b>رقم البلاغ:</b> $id</p>
                    <p><b>عنوان البلاغ:</b> $title</p>
                    <p><b>الحالة الجديدة:</b> $status</p>
                    <p>شكرًا لمساهمتك في تحسين المدينة.</p>
                </div>
            ";

            sendNotificationEmail($email, $subject, $body);
        }
    }

    echo json_encode(["status" => "success"], JSON_UNESCAPED_UNICODE);

} else {
    echo json_encode(["status" => "error"], JSON_UNESCAPED_UNICODE);
}
?>