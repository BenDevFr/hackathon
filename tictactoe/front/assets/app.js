console.log('%capp.js :: 1 =============================', 'color: #f00; font-size: 1rem');
console.log("APP loaded");

class TicTacToe {
    target;
    rowsColsNumber;
    elementTag = 'div';
    grid = null;

    constructor(target, rowsColsNumber) {
        this.target = target;
        this.rowsColsNumber = rowsColsNumber;
        this.setGrid(this.rowsColsNumber);
        console.log(this.target);
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
        this.grid.forEach(row => {
            row.forEach(cell => {
                const newCell = document.createElement(this.elementTag);
                newCell.classList.add('box');
                this.target.appendChild(newCell);
                newCell.addEventListener('click', (evt) => {
                    console.log('click');
                });
            })
        });
    }
}
const target = document.getElementById('board');
console.log(target);
const game = new TicTacToe(target, 3);

game.render();