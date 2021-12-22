<!DOCTYPE html>
<html lang="pt_BR">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PhP</title>
</head>
<body>
  <?php
    $nome = "Tom";
    $idade = 2;
    $comidas_favoritas = array();
    if($_POST) {
      $nome = $_POST["nome"];
      $idade = $_POST["idade"];
      $comidas_favoritas = $_POST["comidas"];
    }

    $fofura = 10.0;
    $isMale = true;

    echo "<h1>Formulários</h1>";
    echo "<p>$nome tem $idade anos e é uma fofura nota $fofura</p>";

    if(count($comidas_favoritas) > 0) {
      echo "<p>Ele adora comer</p>";
      echo "<ul>";

      for ($i = 0; $i < count($comidas_favoritas); $i++) { 
        echo "<li>$comidas_favoritas[$i]</li>";
      }

      echo "</ul>";
    }
  ?>

  <form action="/hello_world/index.php" method="POST">
    <fieldset>
      <legend>Digite nos campos para alterar o texto</legend>
      <label for="nome">Nome:</label>
      <input type="text" id="nome" name="nome"/>

      <label for="idade">Idade:</label>
      <input type="text" id="idade" name="idade"/>

      <label for="melao">Melão</label>
      <input type="checkbox" name="comidas[]" id="melao" value="melao"/>
      <label for="maca">Maçã</label>
      <input type="checkbox" name="comidas[]" id="maca" value="maçã"/>
      <label for="pera">Pêra</label>
      <input type="checkbox" name="comidas[]" id="pera" value="pêra"/>

      <input type="submit" value="Enviar">
    </fieldset>
  </form>
</body>
</html>