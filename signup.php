<?php
include 'connect.php';

$username = $_POST["name"];
$pw = $_POST["password"];

$salt = password_hash(random_bytes(32), PASSWORD_DEFAULT);
$saltedPW =  $pw . $salt;
$hashedPW = hash('sha256', $saltedPW);

$stmt = $conn->prepare('insert into user (name, pw, salt) values (?, ?, ?)');
$stmt->bind_param('sss', $username, $hashedPW, $salt);

if ($stmt->execute()) {
    echo "New account created successfully";
} else {
    echo "Error:" . $conn->error;
}

$conn->close();
?>
