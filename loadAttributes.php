<?php
session_start();
include 'connect.php';

$resultArray = [];

$stmt = $conn->prepare('SELECT * FROM attributes WHERE userid = (select id from user where name = ?) ORDER BY name');
$stmt->bind_param('s', $_SESSION['username']);
$stmt->execute();
$result = $stmt->get_result();

while($row = $result->fetch_assoc()) {
    $stmt = $conn->prepare('SELECT * FROM log WHERE attrId = ? AND day = CAST(NOW() AS DATE)');
    $stmt->bind_param('s', $row['id']);
    $stmt->execute();
    $todayResult = $stmt->get_result();
    $loggedToday = false;
    if ($todayResult->num_rows > 0) {
        $loggedToday = true;
    }

    $resultArray[] = array("id" => $row['id'], "name" => $row['name'], "description" => $row['description'], "format" => $row['format'], "today" => $loggedToday);
}

echo json_encode($resultArray);
$conn->close();
?>
