<?php
include_once "../../views/partials/header.php";
/** @var pdo \PDO */
require_once "../../utils/database_connection.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  require_once "../../utils/validate_product.php";
  require_once "../../utils/save_image.php";

  $new_nome = $_POST["nome"];
  $new_descricao = $_POST["descricao"];
  $new_preco = $_POST["preco"];

  $errors = validate_product($new_nome, $new_preco);

  if (empty($errors)) {
    $new_imagem = $_FILES["imagem"] ?? null;

    $sql = "INSERT INTO produtos (nome, descricao, imagem, preco) VALUES (:nome, :descricao, :imagem, :preco)";
    $statement = $pdo->prepare($sql);
    $statement->bindValue(":nome", $new_nome);
    $statement->bindValue(":descricao", $new_descricao);

    $new_image_path = save_image($new_imagem);

    $statement->bindValue(":imagem", $new_image_path);
    $statement->bindValue(":preco", $new_preco);
    $statement->execute();
  }
}
?>

<!DOCTYPE html>
<html lang="pt_BR">
<body>
  <main>
    <header>
      <a href="index.php">Voltar</a>
      <h1>Cadastrar Produto</h1>
    </header>
    <?php include_once "views/produtos/form.php"; ?>
  </main>
</body>
</html>