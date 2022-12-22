<?php require __DIR__.'/vendor/autoload.php';

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class TestServer implements MessageComponentInterface {
    protected $clients;

    protected $grid = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ];

    public function __construct() {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $sender) {
        $this->clients->attach($sender);
        echo "New connection! ({$sender->resourceId}).\n";

        // foreach ($this->clients as $client) { // BROADCAST
        //     if($conn === $client) {
        //         $this->send($client, 'connection', [
        //             'id' => $client->resourceId
        //         ]);
        //     }
        // }
        $this->broadcast('connection',['id'=>$sender->resourceId]);
    }

    public function broadcast($messageType, $data)
    {
        foreach ($this->clients as $client) {
            // send message to other clients than "sender"
            $this->send($client, $messageType, $data);
        }
    }

    public function send($client, $messageType, $data) {
        $client->send(json_encode([
            'type' => $messageType,
            'data' => $data
        ]));
    }

    public function onMessage(ConnectionInterface $sender, $msg) {
        $message = json_decode($msg);
        echo sprintf("New message from '%s': %s\n\n\n", $sender->resourceId, $msg);

        if($message->type === 'turn') {
            $x = $message->data->x;
            $y = $message->data->y;
            if ($this->grid[$y][$x] == null) {
                $this->grid[$y][$x] = $sender->resourceId;
                print_r($this->grid);
                echo "\n";
                $this->broadcast('turn', [
                    'x' => $message->data->x,
                    'y' => $message->data->y,
                    'id' => $sender->resourceId,
                ]);
            }
            else {
                $this->broadcast('cheat', [
                    'x' => $message->data->x,
                    'y' => $message->data->y,
                    'id' => $sender->resourceId,
                ]);
            }
        }

        // check if winner
        // check lines
        $winner = null;
        foreach ($this->grid as $row) {
            if($row[0] === $row[1] && $row[1] === $row[2]) {
                $winner = $row[0];
                break;
            }
        }

        // check columns
        for($i = 0 ; $i < 2 ; $i++) {
            if($this->grid[0][$i] === $this->grid[1][$i]  && $this->grid[1][$i] === $this->grid[2][$i]) {
                $winner = $this->grid[0][$i];
                break;
            }
        }

        // check diagonals
        if($this->grid[0][0] === $this->grid[1][1] && $this->grid[1][1] === $this->grid[2][2]) {
            $winner = $this->grid[0][0];
        }

        if($this->grid[2][0] === $this->grid[1][1] && $this->grid[1][1] === $this->grid[0][2]) {
            $winner = $this->grid[2][0];
        }

        if($winner) {
            $this->broadcast('win', [
                'winner' => $winner
            ]);

            $this->grid = [
                [null, null, null],
                [null, null, null],
                [null, null, null],
            ];
            return;
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
