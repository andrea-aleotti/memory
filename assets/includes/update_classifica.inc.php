<?php

session_start();
require "./dbconn.inc.php";

if(isset($_SESSION["user"])) {
    $userName = $_SESSION["user"];
    $score = $_POST["finalScore"];
    $conn = openCon();
    $sql = "UPDATE users SET score = $score WHERE name = '$userName'";
    $query = mysqli_query($conn, $sql);
    if($query) {
        die();
    }    
}