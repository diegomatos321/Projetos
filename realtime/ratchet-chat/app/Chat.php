<?php

namespace App;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class Chat implements MessageComponentInterface
{
    protected \SplObjectStorage $clients;
    protected array $rooms;

    public function __construct()
    {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn)
    {
        echo "New connection! ({$conn->resourceId})\n";

        // Store the new connection to send messages to later
        $client_id = uniqid('client_');
        $this->clients[$conn] = ['client_id' => $client_id];

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

        switch ($incomingData['type']) {
                // Handle Join request
            case 'join':
                // $client_id = $this->clients[$from]['client_id'];
                $room_id = $incomingData['room_id'];
                $name = $incomingData['data']['name'];

                if (empty($room_id)) {
                    // Create new room 
                    $room_id = uniqid('room_');
                    $this->clients[$from]['name'] = $name;

                    $this->rooms[$room_id] = [
                        'clients' => [$from]
                    ];
                } else if (array_key_exists($room_id, $this->rooms)) {
                    // Join existing room
                    $this->clients[$from]['name'] = $name;
                    $this->rooms[$room_id]['clients'][] = $from;
                } else {
                    $from->send('Room does not exists');
                    break;
                }

                $body = [
                    'type' => 'joinned',
                    'room_id' => $room_id,
                    'data' => [
                        'client_id' => $this->clients[$from]['client_id'],
                        'name' => $name,
                        'message' => [
                            'name' => 'System',
                            'content' => "Welcome $name!",
                            'created_at' => date('d/m/Y H:m:s')
                        ]
                    ]
                ];
                $encodedBody = json_encode($body);
                // Broadcast to all users inside room
                foreach ($this->rooms[$room_id]['clients'] as $client) {
                    $client->send($encodedBody);
                }
                break;
            case 'update':
                // Sign with current date
                $incomingData['data']['message']['created_at'] = date('d/m/Y H:m:s');

                $body = [
                    'type' => 'updated',
                    'data' => $incomingData['data']
                ];
                $bodyEncoded = json_encode($body);
                foreach ($this->clients as $client) {
                    $client->send($bodyEncoded);
                }
                break;
            default:
                # code...
                break;
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
