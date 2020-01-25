<?php
include 'connect.php';

$username = $_POST["name"];
$pw = $_POST["password"];

$escapedName = mysql_real_escape_string($username);
$escapedPW = mysql_real_escape_string($pw);

# generate a random salt to use for this account
$salt = bin2hex(mcrypt_create_iv(32, MCRYPT_DEV_URANDOM));

$saltedPW =  $escapedPW . $salt;

$hashedPW = hash('sha256', $saltedPW);

$query = "insert into user (name, pw, salt) values ('$escapedName', '$hashedPW', '$salt'); ";

if ($conn->query($query) === TRUE) {
    echo "New account created successfully";
} else {
    echo "Error: " . $query . "<br>" . $conn->error;
}

$conn->close();
?>
