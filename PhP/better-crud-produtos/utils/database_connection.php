<?php

$DB_DRIVER = getenv("DB_DRIVER");
$DB_HOST = getenv("DB_HOST");
$DB_PORT = getenv("DB_PORT");
$DB_NAME = getenv("DB_NAME");
$DB_USER = getenv("DB_USER");
$DB_PASSWORD = getenv("DB_PASSWORD");

$pdo = new PDO("$DB_DRIVER:host=$DB_HOST;port=$DB_PORT;dbname=$DB_NAME", $DB_USER, $DB_PASSWORD);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);