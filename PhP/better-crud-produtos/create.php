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

    if (!is_dir("uploads")) {
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
        $image_path = "uploads/$image_name";

        move_uploaded_file($imagem["tmp_name"], $image_path);
      } else {
        $image_path = null;
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

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
  <title>Cadastrar Produto</title>
  <style>
    body {
      padding: 1rem;
    }
  </style>
</head>
<body>
  <main>
    <header>
      <a href="index.php">Voltar</a>
      <h1>Cadastrar Produto</h1>
    </header>
      <form action="" method="POST" enctype="multipart/form-data">
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
  </main>
</body>
</html>