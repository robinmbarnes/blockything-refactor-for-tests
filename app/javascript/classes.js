/*jslint browser: true*/
/*global  */

const COLOURS = ['red', 'green', 'blue', 'yellow'];
const MAX_X = 10;
const MAX_Y = 10;

class Block {
    constructor (x, y) {
        this.x = x;
        this.y = y;
        this.colour = COLOURS[Math.floor(Math.random() * COLOURS.length)];
        this.hidden = false;
    }
}

class BlockGrid {
    constructor (grid) {

        this.grid = [];

        if(typeof grid !== 'undefined') {

            if(grid.length === 0) {
                throw 'Cannot have an empty grid';
            }

            let columnLength = null;
            grid.forEach(function (col) {
                if(columnLength === null) {
                    columnLength = col.length;

                    return;
                }
                if(col.length !== columnLength) {
                    throw 'All columns must be same length';
                }
                columnLength = col.length;
            });

            this.grid = grid;

            return this;
        }

        for (let x = 0; x < MAX_X; x++) {
            let col = [];
            for (let y = 0; y < MAX_Y; y++) {
                col.push(new Block(x, y));
            }

            this.grid.push(col);
        }

        return this;
    }

    sortGrid () {
        this.grid = this.grid.map(function (col) {
            return col.sort(function (blockA, blockB) {
                if(blockA.hidden === true && blockB.hidden === false) {
                    return 1;
                }
                if(blockB.hidden === true && blockA.hidden === false) {
                    return -1;
                }
                if(blockA.y < blockB.y) {
                    return -1;
                }

                return 1;
            });
        });

        for(let x = 0; x < this.grid.length; x++) {
            for(let y = 0; y < this.grid[x].length; y++) {
                this.grid[x][y].x = x;
                this.grid[x][y].y = y;
            }
        }
    }


    render (el = document.querySelector('#gridEl')) {
        while(el.firstChild) {
            el.removeChild(el.firstChild);
        }
        for (let x = 0; x < this.grid.length; x++) {
            let id = 'col_' + x;
            let colEl = document.createElement('div');
            colEl.className = 'col';
            colEl.id = id;
            el.appendChild(colEl);

            for (let y = this.grid[x].length - 1; y >= 0; y--) {
                let block = this.grid[x][y],
                    id = `block_${x}x${y}`,
                blockEl = document.createElement('div');

                blockEl.id = id;
                blockEl.className = 'block' + (block.hidden ? ' block-hidden' : '');
                blockEl.style.background = block.colour;
                blockEl.addEventListener('click', (evt) => this.blockClicked(evt, block));
                colEl.appendChild(blockEl);
            }
        }

        return this;
    }

    blockClicked (e, block) {
        this.hideBlock(block);
        this.sortGrid();
        this.render();
    }

    hideBlock (block) {
        if(block.hidden === true) {
            return;
        }
        block.hidden = true;

        this.getConnectedBlocks(block)
            .filter((currentBlock) => (currentBlock.colour === block.colour))
            .forEach(this.hideBlock.bind(this));
    }

    getConnectedBlocks (block) {
        let x = block.x;
        let y = block.y;
        let coords = [
            new Coord(x-1, y),
            new Coord(x, y-1),
            new Coord(x, y+1),
            new Coord(x+1, y)
        ];

        let validCoords = coords.filter(
            (coord) => (coord.x >= 0 && coord.y >= 0 && coord.x < this.grid.length && coord.y < this.grid[0].length)
        );

        return validCoords.map(function (coord) {
            return this.grid[coord.x][coord.y];
        }.bind(this));
    }
}

class Coord {
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }
}

function blockFactory(x, y, colour) {
    let block = new Block(x, y);
    block.colour = colour;

    return block;
}

export { BlockGrid, Block, blockFactory }