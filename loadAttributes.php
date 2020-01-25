<?php
session_start();
include 'connect.php';

$resultArray = [];

$stmt = $conn->prepare('SELECT * FROM attributes WHERE userid = (select id from user where name = ?)');
$stmt->bind_param('s', $_SESSION['username']);
$stmt->execute();
$result = $stmt->get_result();

while($row = $result->fetch_assoc()) {
    $resultArray[] = array("id" => $row['id'], "name" => $row['name'], "description" => $row['description'], "format" => $row['format']);
}

echo json_encode($resultArray);
$conn->close();
?>
