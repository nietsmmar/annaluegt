<?php
session_start();
include 'connect.php';
// TODO check if person is logged in first
$resultArray = [];

$id = $_POST['id'];
$value = $_POST['value'];
$date = $_POST['date'];
$activityId = $_POST['activityId'];

$stmt = $conn->prepare('UPDATE log SET value = ?, day = ?, activityId = ? WHERE id = ?');
$stmt->bind_param('ssss', $value, $date, $activityId, $id);

if ($stmt->execute()) {
    echo "Successfully updated entry";
} else {
    echo "Error:" . $conn->error;
}
?>
