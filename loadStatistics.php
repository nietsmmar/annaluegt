<?php
session_start();
include 'connect.php';


$attrId = $_POST['attrId'];
$resultArray = [];

$stmt = $conn->prepare('SELECT * FROM log WHERE userid = (select id from user where name = ?) and attrId = ? ORDER BY day');
$stmt->bind_param('ss', $_SESSION['username'], $attrId);
$stmt->execute();
$result = $stmt->get_result();

while($row = $result->fetch_assoc()) {
    $resultArray[] = array("value" => $row['value'], "day" => $row['day']);
}

echo json_encode($resultArray);
$conn->close();
?>
