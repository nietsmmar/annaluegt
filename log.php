<?php
session_start();
include 'connect.php';

$resultArray = [];

$attrId = $_POST['attrId'];
$value = $_POST['value'];
$date = $_POST['date'];
$activity = $_POST['activity'];


$stmt = $conn->prepare('insert into log (userId, attrId, value, day, activityId) values ((select id from user where name = ?), ?, ?, ?, ?)');
$stmt->bind_param('sssss', $_SESSION['username'], $attrId, $value, $date, $activity);

if ($stmt->execute()) {
    echo "Successfully inserted";
} else {
    echo "Error: " . $query . "<br>" . $conn->error;
}
?>
