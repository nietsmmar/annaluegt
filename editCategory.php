<?php
session_start();
include 'connect.php';

$resultArray = [];

$attrId = $_POST['attrId'];
$name = $_POST['name'];
$description = $_POST['description'];
$format = $_POST['format'];

$stmt = $conn->prepare('UPDATE attributes SET name = ?, description = ?, format = ? WHERE id = ?');
$stmt->bind_param('ssss', $name, $description, $format, $attrId);

if ($stmt->execute()) {
    echo "Successfully updated";
} else {
    echo "Error: " . $query . "<br>" . $conn->error;
}
?>
