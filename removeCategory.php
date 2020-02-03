<?php
session_start();
include 'connect.php';

$resultArray = [];

$attrId = $_POST['attrId'];

$stmt = $conn->prepare('DELETE FROM attributes WHERE id = ?');
$stmt->bind_param('s', $attrId);

if ($stmt->execute()) {
    echo "Successfully removed";
} else {
    echo "Error: " . $query . "<br>" . $conn->error;
}
?>
