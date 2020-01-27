<?php
session_start();
include 'connect.php';

$resultArray = [];

$stmt = $conn->prepare('SELECT * FROM activities WHERE userid = (select id from user where name = ?) ORDER BY name');
$stmt->bind_param('s', $_SESSION['username']);
$stmt->execute();
$result = $stmt->get_result();

while($row = $result->fetch_assoc()) {
    $resultArray[] = array("id" => $row['id'], "name" => $row['name']);
}

echo json_encode($resultArray);
$conn->close();
?>
