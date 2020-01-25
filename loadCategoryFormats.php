<?php
session_start();
include 'connect.php';

$resultArray = [];

$query = "select * from attributeFormats; ";

$result = $conn->query($query);
while($row = $result->fetch_assoc()) {
    $resultArray[] = array("id" => $row['id'], "name" => $row['name'], "description" => $row['description']);
}

echo json_encode($resultArray);
$conn->close();
?>
