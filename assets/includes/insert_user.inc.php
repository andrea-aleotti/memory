<?php


session_start();
require "./dbconn.inc.php";
$user = $_POST["userName"];
$model_json = "";
$conn = openCon();
// controllo che il nome non esista già
$sql = "SELECT * FROM users WHERE name = '$user'";
$query = mysqli_query($conn, $sql);
// se non esiste, lo inserisco
if (mysqli_num_rows($query) === 0) {
    $sql2 = "INSERT INTO users (name) VALUES ('$user')";
    if (mysqli_query($conn, $sql2)) {
        $_SESSION["user"] = $user;
        $model_json = "<li><strong>$user:</strong> 0 pt.</li>";
    }
} else {
    $model_json = -1;
}

echo json_encode($model_json);
die();
