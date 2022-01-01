<?php

namespace app;

class Router {
  public array $getRoutes = [];
  public array $postRoutes = [];

  public function get(string $url, $fn) {
    $this->getRoutes[$url] = $fn;
  }

  public function post(string $url, $fn) {
    $this->postRoutes[$url] = $fn;
  }

  public function resolve() {
    $currentUrl = $_SERVER["PATH_INFO"] ?? "/";
    $currentMethod = $_SERVER["REQUEST_METHOD"];

    if($currentMethod === "GET") {
      $fn = $this->getRoutes[$currentUrl] ?? null;
    } else {
      $fn = $this->postRoutes[$currentUrl] ?? null;
    }

    if ($fn) {
      call_user_func($fn);
    } else {
      echo "Error 404 Page Not Found";
    }
  }
}