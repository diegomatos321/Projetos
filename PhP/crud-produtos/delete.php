<?php

require_once "database_connection.php";

$id = $_GET["id"];

$sql = "SELECT * FROM produtos WHERE id = :id";
$statement = $pdo->prepare($sql);
$statement->bindValue(":id", $id);
$statement->execute();
$produto = $statement->fetch(PDO::FETCH_ASSOC);

$current_image = $produto["imagem"];
if ($current_image && !empty($current_image)) {
  unlink($current_image);
}

$sql = "DELETE FROM produtos WHERE id = :id";
$statement = $pdo->prepare($sql);
$statement->bindValue(":id", $id);
$statement->execute();

header("Location: index.php");