<?php

namespace App;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class Chat implements MessageComponentInterface
{
    protected \SplObjectStorage $clients;

    public function __construct()
    {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn)
    {
        // Store the new connection to send messages to later
        $client_id = uniqid('client_');
        $this->clients->attach($conn, ['client_id' => $client_id]);

        echo "New connection! ({$conn->resourceId})\n";

        $body = [
            'type' => 'connected',
            'data' => [
                'client_id' => $client_id
            ]
        ];
        $conn->send(json_encode($body));
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {
        $incomingData = json_decode($msg, true);
        $incomingData['created_at'] = date('d/m/Y H:m:s');
        
        $body = [
            'client_id' => $this->clients[$from]['client_id'],
            'type' => 'updated',
            'data' => $incomingData
        ];
        $bodyEncoded = json_encode($body);
        foreach ($this->clients as $client) {
            $client->send($bodyEncoded);
        }
    }

    public function onClose(ConnectionInterface $conn)
    {
        // The connection is closed, remove it, as we can no longer send it messages
        $this->clients->detach($conn);

        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "An error has occurred: {$e->getMessage()}\n";

        $conn->close();
    }
}
