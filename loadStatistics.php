<?php
session_start();
include 'connect.php';


$attrId = $_POST['attrId'];
$resultArray = [];

$stmt = $conn->prepare('SELECT * FROM log, activities WHERE log.activityId = activities.id AND log.userid = (select id from user where name = ?) and log.attrId = ? ORDER BY day');
$stmt->bind_param('ss', $_SESSION['username'], $attrId);
$stmt->execute();
$result = $stmt->get_result();

$activity = "";
while($row = $result->fetch_assoc()) {
    if ($row['name'] != "no activity")
        $activity = $row['name'];
    $resultArray[] = array("value" => $row['value'], "day" => $row['day'], "activity" => $activity);
}

echo json_encode($resultArray);
$conn->close();
?>
