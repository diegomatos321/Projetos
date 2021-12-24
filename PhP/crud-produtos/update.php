<!DOCTYPE html>
<html lang="pt_BR">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Update</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
</head>

<body>
  <?php
  require_once "database_connection.php";

  $id = $_GET["id"];

  if (!$id) {
    header("Location: index.php");
    exit();
  }

  $sql = "SELECT * FROM produtos WHERE id = :id";
  $statement = $pdo->prepare($sql);
  $statement->bindValue(":id", $id);
  $statement->execute();

  $produto = $statement->fetch(PDO::FETCH_ASSOC);

  $nome = $produto["nome"];
  $descricao = $produto["descricao"];
  $imagem = $produto["imagem"];
  $preco = $produto["preco"];
  ?>
  <main>
    <a href="index.php">Tela inicial</a>
    <h1>Modifica Produto <?php echo $nome?></h1>

    <form action="" method="POST" enctype="multipart/form-data">
      <?php if ($imagem): ?>
        <img src="<?php echo $imagem?>" alt="Imagem de <?php echo $nome?>" width="150px"/>
      <?php endif;?>
      <div class="mb-3">
        <input type="file" name="imagem" id="imagem" />
      </div>
      <div class="mb-3">
        <label for="nome" class="form-label">Nome do Produto</label>
        <input type="text" class="form-control" id="nome" name="nome" aria-describedby="Nome do Produto" value="<?php echo $nome?>">
      </div>
      <div class="mb-3">
        <label for="Descrição" class="form-label">Descrição</label>
        <br />
        <textarea name="descricao" id="Descrição" class="form-control"><?php echo $descricao?></textarea>
      </div>
      <div class="mb-3">
        <label for="preço">Preço do Produto</label>
        <input type="number" name="preco" id="preço" step="0.01" value="<?php echo $preco?>" class="form-control" />
      </div>
      <button type="submit" class="btn btn-primary">Criar</button>
    </form>
  </main>
</body>

</html>