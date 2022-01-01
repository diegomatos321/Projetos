<?php

namespace app\controllers;

class ProductController {
  private \app\DataBase $dataBaseConnection;

  public function __construct() {
    $this->dataBaseConnection = new \app\DataBase();
  }

  public function index() {
    echo "Home Page";
    // $allProducts = $this->dataBaseConnection->selectAll("produtos");

    // $this->print($allProducts);
  }

  public function create() {
    
  }

  public function update() {
    
  }

  public function delete() {
    
  }

  public function createPage() {
    echo "Show Product Create Page";
  }

  public function updatePage() {
    echo "Show Product Update Page";
  }

  public function deletePage() {
    echo "Show Product Delete Page";
  }

  private function print(array $items) {
    var_dump($items);
  }
}