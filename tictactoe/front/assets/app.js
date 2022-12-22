console.log('%capp.js :: 1 =============================', 'color: #f00; font-size: 1rem');
console.log("APP loaded");

class TicTacToe {
    target;
    rowsColsNumber;
    elementTag = 'div';
    grid = null;
    playerIndex = 0;
    canPlay = true;
    logsTarget = document.getElementById('logs');
    client = null;

    constructor(target, rowsColsNumber, server = 'ws://localhost:8888') {
        this.target = target;
        this.rowsColsNumber = rowsColsNumber;
        this.setGrid(this.rowsColsNumber);
        this.client = new Client(server);
        this.client.connect();

        this.client.eventListeners['turn'] = (event) => {
          this.handleTurn(event)
        }
        this.client.eventListeners['win'] = (event) => {
          this.handleWin(event)
        }
        this.client.eventListeners['cheat'] = (event) => {
          this.handleCheat(event)
        }

        this.client.eventListeners['connection'] = (event) => {
            this.handleConnection(event)
          }

        /*
        this.client.addEventListener('turn', (event) => {
          this.handleTurn(event)
        })
        */
    }

    handleWin(response) {
      if(response.data.winner == this.client.id) {
        alert('You win');
      }
      else {
        alert('You lose');
      }

      this.target.innerHTML = '';
      this.render();
    }

    handleTurn(response) {
      const x = response.data.x;
      const y = response.data.y;
      const playerId = response.data.id

      const cell = document.querySelector(`div[data-x="${x}"][data-y="${y}"]`);

      if(this.client.id === playerId ) {
        cell.classList.add('player-0');
        this.canPlay = false;
      }
      else {
        cell.classList.add('player-1');
        this.canPlay = true;
      }

      const log = document.createElement('p');
      log.innerHTML = "Player " + playerId + " click on the cell : " + x + "," +y;
      this.logsTarget.appendChild(log);


    }

    handleCheat(response) {
      if(response.data.id == this.client.id) {
        alert('Il ne faut pas tricher petit rigolo');
        this.canPlay = true;
      }
      else {
        alert('Votre adversaire est un petit rigolo et a essayé de tricher');
      }
    }

    handleConnection(response){
        const log = document.createElement('p');
        log.innerHTML = "Player " + this.client.id + " connected";
        this.logsTarget.appendChild(log);
    }

    setGrid(rowsColsNumber) {
        this.grid = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];


        return this.grid;
    }

    render() {
        this.grid.forEach((row, rowKey) => {
            row.forEach((cell, cellKey) => {
                const newCell = document.createElement(this.elementTag);
                newCell.classList.add('box');

                newCell.dataset.x = cellKey;
                newCell.dataset.y = rowKey;

                this.target.appendChild(newCell);
                newCell.addEventListener('click', (evt) => {
                  this.handleClick(evt);
                });
            })
        });
    }

    handleClick(evt) {
      if(!this.canPlay) {
        return;
      }

      const cell = evt.currentTarget
      const x = cell.dataset.x;
      const y = cell.dataset.y;
      console.log('click : ' + x + ',' + y);

      this.client.sendMessage({
        type: 'turn',
        data: {
          x: x,
          y: y,
        }
      });

      this.canPlay = false;
    }
}
const target = document.getElementById('board');
console.log(target);
const game = new TicTacToe(target, 3, 'ws://jlb.ninja:8888');

game.render();