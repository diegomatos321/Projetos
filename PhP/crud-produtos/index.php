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

    $sql = "SELECT * FROM produtos ORDER BY data_criacao DESC";
    $statement = $pdo->prepare($sql);
    $statement->execute();

    $produtos = $statement->fetchAll(PDO::FETCH_ASSOC);
  ?>
</head>
<body>
  <h1>Gerencie seus produtos</h1>
  <?php require_once "create_form.php" ?>
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
      <?php foreach ($produtos as $produto): ?>
        <tr>
          <th scope="row"><?php echo $produto["id"] ?></th>
          <td><?php echo $produto["nome"] ?></td>
          <td><?php echo $produto["descricao"] ?></td>
          <td><?php echo $produto["preco"] ?></td>
          <td><?php echo $produto["data_criacao"] ?></td>
          <td>
            <button type="button" class="btn btn-info">Editar</button>
            <button type="button" class="btn btn-danger">Deletar</button>
          </td>
        </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
</body>
</html>