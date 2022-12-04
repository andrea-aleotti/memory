<?php

include "./dbconn.inc.php";
$conn = openCon();
$sql = "SELECT * FROM users ORDER BY score DESC LIMIT 10";
$query = mysqli_query($conn, $sql);
$classifica = array();
if (mysqli_num_rows($query) > 0) {
    while ($row = mysqli_fetch_assoc($query)) {
        array_push($classifica, "<li><strong>" . $row["name"] .":</strong> " . $row["score"] . "pt.</li>");
    }
}

echo json_encode($classifica);
die();