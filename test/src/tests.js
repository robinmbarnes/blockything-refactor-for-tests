var expect = chai.expect;

import { BlockGrid, Block, blockFactory } from 'classes.js'

function simplifyGrid(grid) {
    return grid.map(function (col) {
        return col.map(function (block) {
            if(block.hidden) {
                return 'hidden';
            }

            return block.colour;
        })
    });
}

describe('BlockGrid', function () {

    it('Is constructed correctly', function () {
        let blockGrid = new BlockGrid();
        console.log(simplifyGrid(blockGrid.grid));
        expect(blockGrid).to.be.an.instanceOf(BlockGrid);
        expect(blockGrid.grid).to.be.an.instanceOf(Array);
    });

    it('Removes a single block correctly', function () {
        let clickedBlock = blockFactory(0, 0, 'red');
        let testGrid = [
            [clickedBlock, blockFactory(0, 1, 'blue')],
            [blockFactory(1, 0, 'green'), blockFactory(1, 1, 'yellow')]
        ];
        let blockGrid = new BlockGrid(testGrid);
        blockGrid.hideBlock(clickedBlock);
        blockGrid.sortGrid();
        expect(simplifyGrid(blockGrid.grid)).to.eql([
            ['blue', 'hidden'],
            ['green', 'yellow']
        ]);

    });

    it('Removes a multiple blocks correctly', function () {
        let clickedBlock = blockFactory(0, 0, 'red');
        let testGrid = [
            [clickedBlock, blockFactory(0, 1, 'red')],
            [blockFactory(1, 0, 'green'), blockFactory(1, 1, 'yellow')]
        ];
        let blockGrid = new BlockGrid(testGrid);
        blockGrid.hideBlock(clickedBlock);
        blockGrid.sortGrid();
        expect(simplifyGrid(blockGrid.grid)).to.eql([
            ['hidden', 'hidden'],
            ['green', 'yellow']
        ]);

    });

    it('Removes a blocks correctly with multiple calls to hideBlock', function () {
        let clickedBlock1 = blockFactory(0, 0, 'red');
        let clickedBlock2 = blockFactory(0, 1, 'blue');
        let testGrid = [
            [clickedBlock1, clickedBlock2],
            [blockFactory(1, 0, 'green'), blockFactory(1, 1, 'yellow')]
        ];
        let blockGrid = new BlockGrid(testGrid);
        blockGrid.hideBlock(clickedBlock1);
        blockGrid.sortGrid();
        blockGrid.hideBlock(clickedBlock2);
        blockGrid.sortGrid();
        expect(simplifyGrid(blockGrid.grid)).to.eql([
            ['hidden', 'hidden'],
            ['green', 'yellow']
        ]);

    });

});

describe('blockFactory', function () {

    it('Creates block with correct x, y and colour', function () {
        let params = [
            { x: 1, y: 2, colour: 'red' },
            { x: 10, y: 32, colour: 'green' }
        ];

        params.forEach(function (paramList) {
            let block = blockFactory(paramList.x, paramList.y, paramList.colour);
            expect(block.x).to.equal(paramList.x);
            expect(block.y).to.equal(paramList.y);
            expect(block.colour).to.equal(paramList.colour);
        });
    });

});