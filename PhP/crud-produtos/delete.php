<?php

require_once "database_connection.php";

$id = $_GET["id"];

$sql = "DELETE FROM produtos WHERE id = :id";
$statement = $pdo->prepare($sql);
$statement->bindValue(":id", $id);
$statement->execute();

header("Location: index.php");