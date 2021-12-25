<!DOCTYPE html>
<html lang="pt_BR">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CRUD PhP</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
  <style>
    body {
      padding: 1rem;
    }
  </style>

  <?php
  require_once "database_connection.php";

  $search = $_GET["search"] ?? null;

  if ($search && !empty($search)) {
    $sql = "SELECT * FROM produtos WHERE nome LIKE :search ORDER BY data_criacao DESC";
    $statement = $pdo->prepare($sql);
    $statement->bindValue(":search", "%$search%");
  } else {
    $sql = "SELECT * FROM produtos ORDER BY data_criacao DESC";
    $statement = $pdo->prepare($sql);
  }
  
  $statement->execute();

  $produtos = $statement->fetchAll(PDO::FETCH_ASSOC);
  ?>
</head>

<body>
  <main>
    <header>
      <h1>Gerencie seus produtos</h1>
      <a class="btn btn-success" href="create.php">Criar Produto</a>
    </header>
    <br/>
    <form action="" method="GET">
      <div class="input-group mb-3">
        <input type="text" name="search" id="search" class="form-control" placeholder="Busque por produtos" value="<?php echo $search?>"/>
        <button type="submit" class="btn btn-primary">Buscar</button>
      </div>
    </form>
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">id</th>
          <th scope="col">Nome Produto</th>
          <th scope="col">Descrição</th>
          <th scope="col">Preço</th>
          <th scope="col">Data de Criação</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($produtos as $produto) : ?>
          <tr>
            <th scope="row">
              <?php echo $produto["id"] ?>
              <?php if ($produto["imagem"] && !empty($produto["imagem"])) : ?>
                <img src=<?php echo $produto["imagem"] ?> alt=<?php echo $produto["imagem"] ?> width=100 />
              <?php endif; ?>
            </th>
            <td><?php echo $produto["nome"] ?></td>
            <td><?php echo $produto["descricao"] ?></td>
            <td>R$ <?php echo $produto["preco"] ?></td>
            <td><?php echo $produto["data_criacao"] ?></td>
            <td>
              <a href="update.php?id=<?php echo $produto["id"] ?>" class="btn btn-info">Editar</a>
              <a href="delete.php?id=<?php echo $produto["id"] ?>" class="btn btn-danger">Deletar</a>
            </td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>

  </main>
</body>

</html>