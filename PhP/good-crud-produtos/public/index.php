<?php

require_once __DIR__."/../vendor/autoload.php";

use app\Router;
use app\controllers\ProductController;

$router = new Router();
$controller = new ProductController();

// $router->get("/", [ProductController::class, "index"]);
$router->get("/produtos", [$controller, "index"]);
$router->get("/produtos/create", [ProductController::class, "createPage"]);
$router->get("/produtos/update", [ProductController::class, "updatePage"]);
$router->get("/produtos/delete", [ProductController::class, "deletePage"]);
$router->post("/produtos/create", [ProductController::class, "create"]);
$router->post("/produtos/update", [ProductController::class, "update"]);
$router->post("/produtos/delete", [ProductController::class, "delete"]);

$router->resolve();