<?php
session_start();
include 'connect.php';

$resultArray = [];
$username = $_POST["name"];
$pw = $_POST["password"];

$stmt = $conn->prepare('SELECT salt FROM user WHERE name = ?');
$stmt->bind_param('s', $username);
$stmt->execute();

$result = $stmt->get_result();
$salt = null;
while($row = $result->fetch_assoc()) {
    $salt = $row['salt'];
}

if (is_null($salt)) {
    $resultArray['error'] = "Login failed! Account does not exist!";
    echo json_encode($resultArray);
    return;
}

$saltedPW =  $pw . $salt;

$hashedPW = hash('sha256', $saltedPW);

$stmt = $conn->prepare('SELECT * FROM user WHERE name = ? and pw = ?');
$stmt->bind_param('ss', $username, $hashedPW);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows == 0)
    $resultArray['error'] = "Login failed!";
else {
    $resultArray['success'] = "Login successful!";
    while($row = $result->fetch_assoc()) {
        $_SESSION["username"] = $row['name'];
    }
}

echo json_encode($resultArray);
$conn->close();
?>
