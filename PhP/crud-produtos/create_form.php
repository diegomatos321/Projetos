<?php
  require_once "database_connection.php";

  $errors = [];

  if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nome = $_POST["nome"];
    $descricao = $_POST["descricao"];
    $preco = $_POST["preco"];

    if (!$nome || empty($nome)) {
      array_push($errors, "Produto precisa de um nome");
    }

    if (!$preco || empty($preco)) {
      array_push($errors, "O Produto precisa ter um preço.");
    }

    if (!is_dir("./uploads")) {
      mkdir("uploads");
    }

    if (empty($errors)) {
      $imagem = $_FILES["imagem"] ?? null;
      $image_path = "";

      // $sql = "INSERT INTO produtos (nome, descricao, imagem, preco) VALUES (:nome, :descricao, :imagem, :preco)";
      $sql = "INSERT INTO produtos (nome, descricao, imagem, preco) VALUES (:nome, :descricao, :imagem, :preco)";
      $statement = $pdo->prepare($sql);
      $statement->bindValue(":nome", $nome);
      $statement->bindValue(":descricao", $descricao);

      if ($imagem && !empty($imagem["name"])) {
        $image_name = $imagem["name"];
        $image_path = "./uploads/$image_name";

        move_uploaded_file($imagem["tmp_name"], $image_path);
      } else {
        $image_name = null;
      }
      
      $statement->bindValue(":imagem", $image_path);
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