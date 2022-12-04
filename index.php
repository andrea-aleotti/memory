<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Memory Game</title>
    <!-- Bootstrap 5-->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <!-- jQuery -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <!-- stili -->
    <link rel="stylesheet" type="text/css" href="assets/css/style.css">
</head>

<body>
    <main class="container-lg">
        <div class="row my-5">
            <!-- sezione classifica -->
            <div class="col-md-3">
                <!-- form per la registrazione utente -->
                <form>
                    <label for="user" class="form-label">Username:</label>
                    <input type="text" name="user" id="user" class="form-control">
                    <div class="d-none" id="error"></div>
                    <button type="button" id="signup" name="signup" class="btn btn-danger mt-3">Registrati</button>
                </form><!-- fine form -->

                <hr>

                <!-- classifica al reload della pagina -->
                <?php
                include "assets/includes/dbconn.inc.php";
                $conn = openCon();
                $sql = "SELECT * FROM users ORDER BY score DESC LIMIT 10";
                $query = mysqli_query($conn, $sql);
                echo "<ol id='classifica'>";
                if(mysqli_num_rows($query) > 0) {
                    while($row = mysqli_fetch_assoc($query)) {
                        ?>
                        <li><strong><?php echo $row["name"]; ?>:</strong> <?php echo $row["score"]; ?> pt.</li>
                        <?php
                    }
                }
                echo "</ol>";
                mysqli_close($conn);
                ?><!-- fine classifica -->

            </div><!-- fine sezione classifica -->

            <!-- sezione di gioco -->
            <div class="col-md-9">
                <button type="button" class="btn btn-primary d-block mx-auto px-3 my-4" id="play">Play</button>
                <div class="row g-2" id="board"></div>
                <div class="my-5 text-center">
                    <h3>Score: <span id="score"></span></h3>
                </div>
            </div><!-- fine sezione di gioco -->
        </div>
    </main>

    <script src="assets/js/script.js"></script>
</body>

</html>