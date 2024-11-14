<?php

require __DIR__ . '/vendor/autoload.php';

use Ratchet\Server\IoServer;
use App\Chat;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new Chat()
        )
    ), 
    8080
);

$server->run();
