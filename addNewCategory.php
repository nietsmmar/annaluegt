<?php
session_start();
include 'connect.php';

$resultArray = [];

$name = mysql_real_escape_string($_POST['name']);
$description = mysql_real_escape_string($_POST['description']);
$format = mysql_real_escape_string($_POST['format']);


$query = "insert into attributes (userId, name, description, format) values ((select id from user where name = '".$_SESSION['username']."'), '$name', '$description', '$format'); ";
echo $query;

if ($conn->query($query) === TRUE) {
    echo "Successfully inserted";
} else {
    echo "Error: " . $query . "<br>" . $conn->error;
}
?>
