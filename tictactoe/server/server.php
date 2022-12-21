<?php require __DIR__.'/vendor/autoload.php';

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class TestServer implements MessageComponentInterface {
    protected $clients;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn) {
        $this->clients->attach($conn);
        echo "New connection! ({$conn->resourceId}).\n";

        foreach ($this->clients as $client) { // BROADCAST
            if($conn === $client) {
                $this->send($client, 'connection', [
                    'id' => $client->resourceId
                ]);
            }
        }
    }

    public function send($client, $messageType, $data) {
        $client->send(json_encode([
            'type' => $messageType,
            'data' => $data
        ]));
    }

    public function onMessage(ConnectionInterface $conn, $msg) {
        echo sprintf("New message from '%s': %s\n\n\n", $conn->resourceId, $msg);
        foreach ($this->clients as $client) { // BROADCAST
            $message = json_decode($msg, true);
            if ($conn !== $client || true) {
                $this->send($client, 'message', [
                    'message' => $message
                ]);
            }
        }
    }

    public function onClose(ConnectionInterface $conn) {
        $this->clients->detach($conn);
        echo "Connection {$conn->resourceId} is gone.\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "An error occured on connection {$conn->resourceId}: {$e->getMessage()}\n\n\n";
        $conn->close();
    }
}

define('APP_PORT', 8888);
$ws = new WsServer(new TestServer);
$server = IoServer::factory(new HttpServer($ws), APP_PORT);
$server->run();