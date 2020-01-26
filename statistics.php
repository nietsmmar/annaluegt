<?php
session_start();
include 'connect.php';

?>

<html>
<head>
    <title>AnnaLügt</title>
    <meta name="description" content="Analyze yourself" />
    <meta property="og:title" content="Anna lügt!" />
    <meta property="og:description" content="Analyze yourself" />
    <meta property="og:url" content="http://annalügt.raphael-fritz.de" />
    <meta property="og:image" content="http://library.raphael-fritz.de/book.jpg" />

    <!-- MDB icon -->
    <link rel="icon" href="img/favicon.png" type="image/x-icon">
    <!-- Bootstrap core CSS -->
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <!-- Material Design Bootstrap -->
    <link rel="stylesheet" href="css/mdb.min.css">
    <!-- Your custom styles (optional) -->
    <link rel="stylesheet" href="css/style.css">

    <link rel="stylesheet" href="css/font-awesome-animation.min.css">

    <link rel="stylesheet" href="css/bootstrap-slider.min.css">

    <link rel="stylesheet" href="css/bootstrap-datepicker.min.css">

    <link rel="stylesheet" href="style.css">
</head>
<body>

    <?php
        if (!isset($_SESSION["username"])) {
            include 'forms.html';
        }
        else {
            include 'contentStatistics.html';
        }
    ?>

    <!-- jQuery -->
    <script type="text/javascript" src="js/jquery.min.js"></script>
    <!-- Bootstrap tooltips -->
    <script type="text/javascript" src="js/popper.min.js"></script>
    <!-- Bootstrap core JavaScript -->
    <script type="text/javascript" src="js/bootstrap.min.js"></script>
    <!-- MDB core JavaScript -->
    <script type="text/javascript" src="js/mdb.min.js"></script>
    <!-- Your custom scripts (optional) -->

    <script type="text/javascript" src="js/bootstrap-slider.min.js"></script>

    <script type="text/javascript" src="js/bootstrap-datepicker.min.js"></script>

    <script type="text/javascript" src="js/jquery.canvasjs.min.js"></script>

    <script type="text/javascript" src="script.js"></script>

</body>
</html>
