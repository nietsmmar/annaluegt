<?php
session_start();
include 'connect.php';

$resultArray = [];
$username = $_POST["name"];
$pw = $_POST["password"];

$escapedName = mysql_real_escape_string($username);
$escapedPW = mysql_real_escape_string($pw);

$saltQuery = "select salt from user where name = '$escapedName';";

$result = $conn->query($saltQuery);
$salt = null;
while($row = $result->fetch_assoc()) {
    $salt = $row['salt'];
}
if (is_null($salt)) {
    $resultArray['error'] = "Login failed! Account does not exist!";
    echo json_encode($resultArray);
    return;
}

$saltedPW =  $escapedPW . $salt;

$hashedPW = hash('sha256', $saltedPW);

$query = "select * from user where name = '$escapedName' and pw = '$hashedPW'; ";

$result = $conn->query($query);

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
