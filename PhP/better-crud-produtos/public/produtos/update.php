<!DOCTYPE html>
<html lang="pt_BR">

<?php
include_once "../../views/partials/header.php";
require_once "../../utils/database_connection.php";

if ($_SERVER["REQUEST_METHOD"] === "GET") {
  $id = $_GET["id"];
} else if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $id = $_POST["id"];
}

if (!$id || empty($id)) {
  header("Location: index.php");
  exit();
}

$sql = "SELECT * FROM produtos WHERE id = :id";
$statement = $pdo->prepare($sql);
$statement->bindValue(":id", $id);
$statement->execute();

$produto = $statement->fetch(PDO::FETCH_ASSOC);

$current_nome = $produto["nome"];
$current_descricao = $produto["descricao"];
$current_imagem = $produto["imagem"] ?? null;
$current_preco = $produto["preco"];

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  require_once "../../utils/validate_product.php";
  require_once "../../utils/save_image.php";

  $new_nome = $_POST["nome"];
  $new_descricao = $_POST["descricao"];
  $new_imagem = $_FILES["imagem"] ?? null;
  $new_preco = $_POST["preco"];

  $errors = validate_product($new_nome, $new_preco);

  if (empty($errors)) {
    $sql = "UPDATE produtos SET nome = :nome, descricao = :descricao, imagem = :imagem, preco = :preco WHERE id = :id";
    $statement = $pdo->prepare($sql);
    $statement->bindValue(":nome", $new_nome);
    $statement->bindValue(":descricao", $new_descricao);

    $new_image_path = save_image($new_image, $current_imagem);

    $statement->bindValue(":imagem", $new_image_path);
    $statement->bindValue(":preco", $new_preco);
    $statement->bindValue(":id", $id);
    $statement->execute();
  }
}
?>

<body>
  <main>
    <a href="index.php">Tela inicial</a>
    <h1>Modifica Produto <?php echo $current_nome ?></h1>
    <?php include_once "views/produtos/form.php";?>
  </main>
</body>

</html>