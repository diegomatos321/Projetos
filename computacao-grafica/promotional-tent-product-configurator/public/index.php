<?php
    // Helper function to load Vite assets dynamically
    function vite_asset($path) {
        // if (file_exists(__DIR__ . '/vite-dev')) {
            return "http://localhost:5173" . $path;
        // }
        // return "/public/js/" . basename($path);
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D Promotional Tent Configurator</title>
    <link rel="stylesheet" href="<?= vite_asset("/dist/css/index.css") ?>">
</head>
<body>
    <main>
        <section class="text-3xl font-bold underline">
            <h1>3D Promotional Tent Configurator</h1>
            <div id="container"></div>
            <div style="width: 600px; height: 600px;" id="configurator"></div>
        </section>
    </main>

    <script type="module" src="<?= vite_asset("/dist/js/index.js") ?>"></script>
</body>
</html>