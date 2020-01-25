<?php
session_start();
include 'connect.php';

$resultArray = [];

$attrId = mysql_real_escape_string($_POST['attrId']);
$value = mysql_real_escape_string($_POST['value']);
$date = mysql_real_escape_string($_POST['date']);


$query = "insert into log (userId, attrId, value, day) values ((select id from user where name = '".$_SESSION['username']."'), '$attrId', '$value', '$date'); ";
echo $query;

if ($conn->query($query) === TRUE) {
    echo "Successfully inserted";
} else {
    echo "Error: " . $query . "<br>" . $conn->error;
}
?>
