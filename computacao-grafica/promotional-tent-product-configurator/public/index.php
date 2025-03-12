<?php
    // Helper function to load Vite assets dynamically
    function vite_asset($path) {
        // if (file_exists(__DIR__ . '/vite-dev')) {
            return "http://localhost:5173/src" . $path;
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
    <!-- <link rel="stylesheet" href="<?= vite_asset("/css/index.css") ?>"> -->
    <!-- <script defer src="/node_modules/alpinejs/dist/cdn.min.js"></script> -->
</head>
<body>
    <main>
        <section x-data="ProductConfigurator">
            <h1 class="text-3xl font-bold underline text-red-600">3D Promotional Tent Configurator</h1>
            <div x-ref="container"></div>
            <div style="width: 600px; height: 600px;" id="configurator"></div>
            <div x-text="selectedObjectName"></div>
        </section>
    </main>

    <script type="module" src="<?= vite_asset("/js/index.ts") ?>"></script>
    <!-- <script type="module" src="/dist/js/index.js"></script> -->
</body>
</html>