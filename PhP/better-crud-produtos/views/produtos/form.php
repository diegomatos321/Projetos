<?php
if (!isset($current_nome)) {
  $current_nome = "";
}

if (!isset($current_descricao)) {
  $current_descricao = "";
}

if (!isset($current_imagem)) {
  $current_imagem = "";
}

if (!isset($current_preco)) {
  $current_preco = "";
}
?>

<?php if (!empty($errors)) : ?>
  <div class="alert alert-danger">
    <?php foreach ($errors as $error) : ?>
      <div><?php echo $error ?></div>
    <?php endforeach; ?>
  </div>
<?php endif; ?>

<form action="" method="POST" enctype="multipart/form-data">
  <input type="hidden" name="id" value="<?php echo $id ?>">
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