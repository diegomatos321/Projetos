<?php

namespace app;

class Database {
  public \PDO $pdo;

  private string $DB_DRIVER;
  private string $DB_HOST;
  private string $DB_PORT;
  private string $DB_NAME;
  private string $DB_USER;
  private string $DB_PASSWORD;

  public function __construct() {
    $this->DB_DRIVER = getenv("DB_DRIVER");
    $this->DB_HOST = getenv("DB_HOST");
    $this->DB_PORT = getenv("DB_PORT");
    $this->DB_NAME = getenv("DB_NAME");
    $this->DB_USER = getenv("DB_USER");
    $this->DB_PASSWORD = getenv("DB_PASSWORD"); 

    $connectionString = "$this->DB_DRIVER:host=$this->DB_HOST;port=$this->DB_PORT;dbname=$this->DB_NAME";
    $this->pdo = new \PDO($connectionString, $this->DB_USER, $this->DB_PASSWORD);
    $this->pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);  
  }

  public function selectAll(string $tableName): array {
    if($tableName === null || empty($tableName)) {
      return [];
    }

    $sql = "SELECT * FROM $tableName";
    $statement = $this->pdo->query($sql);

    $result = $statement->fetchAll(\PDO::FETCH_ASSOC);

    return $result;
  }

  public function search(string $tableName, array $params): array {
    if($tableName === null || $params === null || empty($tableName) || empty($params)) {
      return [];
    }

    $sql = "SELECT * FROM :table WHERE ";

    for ($i=0; $i < count($params); $i++) { 
      $sql += ":item$i LIKE :value$i ";
    }

    echo $sql;
  }
}