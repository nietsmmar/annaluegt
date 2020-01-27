<?php
session_start();
include 'connect.php';

$resultArray = [];

$name = $_POST['name'];

$stmt = $conn->prepare('INSERT into activities (userId, name) values ((select id from user where name = ?), ?)');
$stmt->bind_param('ss', $_SESSION['username'], $name);

if ($stmt->execute()) {
    echo "Successfully inserted";
} else {
    echo "Error: " . $query . "<br>" . $conn->error;
}
?>
