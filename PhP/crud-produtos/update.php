<!DOCTYPE html>
<html lang="pt_BR">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Update</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
  <style>
    body {
      padding: 1rem;
    }
  </style>
</head>

<body>
  <?php
  require_once "database_connection.php";

  $id = "";
  $current_nome = "";
  $current_descricao = "";
  $current_imagem = "";
  $current_preco = "";

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
    $new_nome = $_POST["nome"];
    $new_descricao = $_POST["descricao"];
    $new_imagem = $_FILES["imagem"] ?? null;
    $new_preco = $_POST["preco"];
    $errors = [];

    if (!$new_nome || empty($new_nome)) {
      array_push($errors, "Produto precisa de um nome");
    }

    if (!$new_preco || empty($new_preco)) {
      array_push($errors, "O Produto precisa ter um preço.");
    }

    if (!is_dir("uploads")) {
      mkdir("uploads");
    }

    if (empty($errors)) {
      $new_image_path = "";

      $sql = "UPDATE produtos SET nome = :nome, descricao = :descricao, imagem = :imagem, preco = :preco WHERE id = :id";
      $statement = $pdo->prepare($sql);
      $statement->bindValue(":nome", $new_nome);
      $statement->bindValue(":descricao", $new_descricao);

      if ($new_imagem && !empty($new_imagem["name"])) {
        if ($current_imagem && !empty($current_imagem)) {
          unlink($current_imagem);
        }

        $image_name = $new_imagem["name"];
        $new_image_path = "uploads/$image_name";

        move_uploaded_file($new_imagem["tmp_name"], $new_image_path);
      } else {
        $new_image_path = $current_imagem;
      }
      
      $statement->bindValue(":imagem", $new_image_path);
      $statement->bindValue(":preco", $new_preco);
      $statement->bindValue(":id", $id);
      $statement->execute();  
    }
  }
  ?>
  <main>
    <a href="index.php">Tela inicial</a>
    <h1>Modifica Produto <?php echo $current_nome ?></h1>

    <form action="" method="POST" enctype="multipart/form-data">
      <input type="hidden" name="id" value="<?php echo $id?>">
      <?php if ($current_imagem) : ?>
        <img src="<?php echo $current_imagem ?>" alt="Imagem de <?php echo $current_nome ?>" width="150px" />
      <?php endif; ?>
      <div class="mb-3">
        <input type="file" name="imagem" id="imagem" />
      </div>
      <div class="mb-3">
        <label for="nome" class="form-label">Nome do Produto</label>
        <input type="text" class="form-control" id="nome" name="nome" aria-describedby="Nome do Produto" value="<?php echo $current_nome ?>">
      </div>
      <div class="mb-3">
        <label for="Descrição" class="form-label">Descrição</label>
        <br />
        <textarea name="descricao" id="Descrição" class="form-control"><?php echo $current_descricao ?></textarea>
      </div>
      <div class="mb-3">
        <label for="preço">Preço do Produto</label>
        <input type="number" name="preco" id="preço" step="0.01" value="<?php echo $current_preco ?>" class="form-control" />
      </div>
      <button type="submit" class="btn btn-primary">Atualizar</button>
    </form>
  </main>
</body>

</html>