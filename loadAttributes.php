<?php
session_start();
include 'connect.php';

$resultArray = [];

$query = "select * from attributes where userid = (select id from user where name = '".$_SESSION['username']."'); ";

$result = $conn->query($query);
while($row = $result->fetch_assoc()) {
    $resultArray[] = array("id" => $row['id'], "name" => $row['name'], "description" => $row['description'], "format" => $row['format']);
}

echo json_encode($resultArray);
$conn->close();
?>
