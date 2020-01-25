<?php
session_start();
include 'connect.php';

$resultArray = [];

$attrId = $_POST['attrId'];
$value = $_POST['value'];
$date = $_POST['date'];


$stmt = $conn->prepare('insert into log (userId, attrId, value, day) values ((select id from user where name = ?), ?, ?, ?)');
$stmt->bind_param('ssss', $_SESSION['username'], $attrId, $value, $date);

if ($stmt->execute()) {
    echo "Successfully inserted";
} else {
    echo "Error: " . $query . "<br>" . $conn->error;
}
?>
