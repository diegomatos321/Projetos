<?php
  require_once "database_connection.php";

  $errors = [];

  if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nome = $_POST["nome"];
    $descricao = $_POST["descricao"];
    // $imagem = $_POST["imagem"];
    $preco = $_POST["preco"];

    if (!$nome || empty($nome)) {
      array_push($errors, "Produto precisa de um nome");
    }

    if (!$preco || empty($preco)) {
      array_push($errors, "O Produto precisa ter um preço.");
    }

    if (empty($errors)) {
      // $sql = "INSERT INTO produtos (nome, descricao, imagem, preco) VALUES (:nome, :descricao, :imagem, :preco)";
      $sql = "INSERT INTO produtos (nome, descricao, preco) VALUES (:nome, :descricao, :preco)";
      $statement = $pdo->prepare($sql);
      $statement->bindValue(":nome", $nome);
      $statement->bindValue(":descricao", $descricao);
      // $statement->bindValue(":imagem", $imagem);
      $statement->bindValue(":preco", $preco);
      $statement->execute();  
    }
  }
?>

<?php if (!empty($errors)): ?>
  <div class="alert alert-danger">
    <?php foreach ($errors as $error): ?>
      <div><?php echo $error ?></div>
    <?php endforeach; ?>
  </div>
<?php endif; ?>

<form action="./" method="POST" enctype="multipart/form-data">
  <div class="mb-3">
    <label for="nome" class="form-label">Nome do Produto</label>
    <input type="text" class="form-control" id="nome" name="nome" aria-describedby="Nome do Produto">
  </div>
  <div class="mb-3">
    <label for="Descrição" class="form-label">Descrição</label>
    <br/>
    <textarea name="descricao" id="Descrição" class="form-control"></textarea>
  </div>
  <div class="mb-3">
    <label for="preço">Preço do Produto</label>
    <input type="number" name="preco" id="preço" step="0.01" class="form-control"/>
  </div>
  <div class="mb-3">
    <input type="file" name="imagem" id="imagem"/>
  </div>
  <button type="submit" class="btn btn-primary">Criar</button>
</form>