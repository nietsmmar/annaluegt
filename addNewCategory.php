<?php
session_start();
include 'connect.php';

$resultArray = [];

$name = $_POST['name'];
$description = $_POST['description'];
$format = $_POST['format'];

$stmt = $conn->prepare('INSERT into attributes (userId, name, description, format) values ((select id from user where name = ?), ?, ?, ?)');
$stmt->bind_param('ssss', $_SESSION['username'], $name, $description, $format);

if ($stmt->execute()) {
    echo "Successfully inserted";
} else {
    echo "Error: " . $query . "<br>" . $conn->error;
}
?>
