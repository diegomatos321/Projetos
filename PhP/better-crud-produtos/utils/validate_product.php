<?php
function validate_product(String $nome, String $preco): array {
  $errors = [];

  if (!$nome || empty($nome)) {
    array_push($errors, "Produto precisa de um nome");
  }

  if (!$preco || empty($preco)) {
    array_push($errors, "O Produto precisa ter um preço.");
  }

  if (!is_dir(__DIR__."uploads")) {
    mkdir(__DIR__."uploads");
  }

  return $errors;
}
?>