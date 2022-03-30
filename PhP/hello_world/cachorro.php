<?php

class Cachorro {
  public string $nome;
  public int $idade;
  public ?array $comidasFavoritas;
  public float $fofura;
  public bool $isMale;

  public function __construct($nome, $idade, $comidasFavoritas, $fofura, $isMale)
  {
    $this->nome = $nome;
    $this->idade = $idade;
    $this->comidasFavoritas = $comidasFavoritas;
    $this->fofura = $fofura;
    $this->isMale = $isMale;
  }
}