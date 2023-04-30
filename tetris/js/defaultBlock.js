class DefaultBlock {
    constructor(bw, bh) {
        this.block = [];
        this.x = 0;
        this.y = 0;
        this.r = 0;
        this.w = 0;
        this.h = 0;
        this.type = 0;
        this.numOfBlockType = 0;
        this.board_width = bw;
        this.board_height = bh;
        this.itemIndex = 0;
        this.itemType = 0;
    }

    getItemIndex() {
        return this.itemIndex;
    }

    getItemType() {
        return this.itemType;
    }

    getType() {
        return this.type;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getR() {
        return this.r;
    }

    set(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }

    rotate() {
        this.r = (this.r + 1) % this.numOfBlockType;
    }

    preRotate() {
        this.r = (this.r - 1 + this.numOfBlockType) % this.numOfBlockType;
    }

    moveLeft() {
        this.x--;
    }

    moveRight() {
        this.x++;
    }

    moveDown() {
        this.y++;
    }

    moveUp() {
        this.y--;
    }

    setItem(index, type) {
        if (index === 0) {
            return;
        }

        this.itemIndex = index;
        this.itemType = type;

        let item = [0, 1, 1, 1, 1];
        item[index] = type;
        for (let r = 0; r < 4; r++) {
            for (let y = 0; y < this.h; y++) {
                for (let x = 0; x < this.w; x++) {
                    this.block[r][y][x] = item[this.block[r][y][x]];
                }
            }
        }
    }
}

class EmptyBlock extends DefaultBlock {
    constructor(bw, bh) {
        super(bw, bh);
        this.type = 0;
    }
}

class OBlock extends DefaultBlock {
    constructor(bw, bh) {
        super(bw, bh);
        this.block = [
            [[1, 2], [3, 4]],
            [[3, 1], [4, 2]],
            [[4, 3], [2, 1]],
            [[2, 4], [1, 3]]];
        this.x = 4;
        this.y = 0;
        this.r = 0;
        this.w = 2;
        this.h = 2;
        this.type = 1;
        this.numOfBlockType = 4;
    }
}

class IBlock extends DefaultBlock {
    constructor(bw, bh) {
        super(bw, bh);
        this.block = [
            [[0, 0, 0, 0],
                [1, 2, 3, 4],
                [0, 0, 0, 0],
                [0, 0, 0, 0]],
            [[0, 0, 1, 0],
                [0, 0, 2, 0],
                [0, 0, 3, 0],
                [0, 0, 4, 0]],
            [[0, 0, 0, 0],
                [0, 0, 0, 0],
                [4, 3, 2, 1],
                [0, 0, 0, 0]],
            [[0, 4, 0, 0],
                [0, 3, 0, 0],
                [0, 2, 0, 0],
                [0, 1, 0, 0]]];
        this.x = 3;
        this.y = 0;
        this.r = 0;
        this.w = 4;
        this.h = 4;
        this.type = 2;
        this.numOfBlockType = 4;
    }
}

class LBlock extends DefaultBlock {
    constructor(bw, bh) {
        super(bw, bh);
        this.block = [
            [[0, 0, 1],
                [2, 3, 4],
                [0, 0, 0]],
            [[0, 2, 0],
                [0, 3, 0],
                [0, 4, 1]],
            [[0, 0, 0],
                [4, 3, 2],
                [1, 0, 0]],
            [[1, 4, 0],
                [0, 3, 0],
                [0, 2, 0]],
        ];
        this.x = 4;
        this.y = 0;
        this.r = 0;
        this.w = 3;
        this.h = 3;
        this.type = 3;
        this.numOfBlockType = 4;
    }
}

class JBlock extends DefaultBlock {
    constructor(bw, bh) {
        super(bw, bh);
        this.block = [
            [[1, 0, 0],
                [2, 3, 4],
                [0, 0, 0]],
            [[0, 2, 1],
                [0, 3, 0],
                [0, 4, 0]],
            [[0, 0, 0],
                [4, 3, 2],
                [0, 0, 1]],
            [[0, 4, 0],
                [0, 3, 0],
                [1, 2, 0]],
        ];
        this.x = 4;
        this.y = 0;
        this.r = 0;
        this.w = 3;
        this.h = 3;
        this.type = 4;
        this.numOfBlockType = 4;
    }
}

class TBlock extends DefaultBlock {
    constructor(bw, bh) {
        super(bw, bh);
        this.block = [
            [[0, 1, 0],
                [2, 3, 4],
                [0, 0, 0]],
            [[0, 2, 0],
                [0, 3, 1],
                [0, 4, 0]],
            [[0, 0, 0],
                [4, 3, 2],
                [0, 1, 0]],
            [[0, 4, 0],
                [1, 3, 0],
                [0, 2, 0]],
        ];
        this.x = 4;
        this.y = 0;
        this.r = 0;
        this.w = 3;
        this.h = 3;
        this.type = 5;
        this.numOfBlockType = 4;
    }
}

class SBlock extends DefaultBlock {
    constructor(bw, bh) {
        super(bw, bh);
        this.block = [
            [[0, 1, 2],
                [4, 3, 0],
                [0, 0, 0]],
            [[0, 4, 0],
                [0, 3, 1],
                [0, 0, 2]],
            [[0, 0, 0],
                [0, 3, 4],
                [2, 1, 0]],
            [[2, 0, 0],
                [1, 3, 0],
                [0, 4, 0]]
        ];
        this.x = 4;
        this.y = 0;
        this.r = 0;
        this.w = 3;
        this.h = 3;
        this.type = 6;
        this.numOfBlockType = 4;
    }
}

class ZBlock extends DefaultBlock {
    constructor(bw, bh) {
        super(bw, bh);
        this.block = [
            [[1, 2, 0],
                [0, 3, 4],
                [0, 0, 0]],
            [[0, 0, 1],
                [0, 3, 2],
                [0, 4, 0]],
            [[0, 0, 0],
                [4, 3, 0],
                [0, 2, 1]],
            [[0, 4, 0],
                [2, 3, 0],
                [1, 0, 0]]
        ];
        this.x = 4;
        this.y = 0;
        this.r = 0;
        this.w = 3;
        this.h = 3;
        this.type = 7;
        this.numOfBlockType = 4;
    }
}

class TetrisBlockFactory {
    constructor() {
        this._index = 0;
        this._nextBlock = [];

        for (let i = 1; i <= 14; i++) {
            let b = [1, 2, 3, 4, 5, 6, 7];
            b.sort(() => Math.random() - 0.5);
            this._nextBlock.push(...b);
        }
        //printf(">> [DefaultBlock]", this._nextBlock);
    }

    initBlock() {
        this._index = 0;
        this._nextBlock.sort(() => Math.random() - 0.5);
    }

    increaseIndex() {
        this._index++;
        if (this._index >= this._nextBlock.length) {
            this.initBlock();
        }
    }

    create() {
        let block = this.getBlock(this._nextBlock[this._index]);
        this.increaseIndex();
        return block;
    }

    getBlock(type) {
        switch (type) {
            case 0:
                return new EmptyBlock();
            case 1:
                return new OBlock();
            case 2:
                return new IBlock();
            case 3:
                return new LBlock();
            case 4:
                return new JBlock();
            case 5:
                return new TBlock();
            case 6:
                return new SBlock();
            case 7:
                return new ZBlock();
            default:
                console.log(">> Tetris Block Create Error! Never come to here!");
                return new IBlock();
        }
    }

    getEmptyBlock() {
        return new EmptyBlock();
    }
}

class ItemTetrisBlockFactory extends TetrisBlockFactory {
    constructor() {
        super();
    }

    create() {
        let block = this.getBlock(this._nextBlock[this._index]);
        this.increaseIndex();
        return Math.random() > 0.08 ? this._addItem(block) : block;
    }

    _addItem(block) {
        let possibility = {
            'G': 12,
            'BLUE': 512,
            'O': 1012, //612
            'R': 9000,
            'BLACK': 9450,
            'BLACK_THUNDER': 9500,
            'ORANGE_THUNDER': 9700,
            'RED_THUNDER': 9710,
            'THUNDER': 9950
        };

        let itemIndex = 0;
        let itemType = 0;

        for (let i = 1; i <= 4; i++) {
            let value = Math.floor(Math.random() * 10000);
            if (value < possibility['G']) {
                itemIndex = i;
                itemType = 11;
                break;
            } else if (value > possibility['G'] && value < possibility['BLUE']) {
                itemIndex = i;
                itemType = 10;
                break;
            } else if (value > possibility['BLUE'] && value < possibility['O']) {
                itemIndex = i;
                itemType = 13;
                break;
            } else if (value > possibility['R'] && value < possibility['BLACK']) {
                itemIndex = i;
                itemType = 12;
                break;
            } else if (value > possibility['BLACK'] && value < possibility['BLACK_THUNDER']) {
                itemIndex = i;
                itemType = 15;
                break;
            } else if (value > possibility['BLACK_THUNDER'] && value < possibility['ORANGE_THUNDER']) {
                itemIndex = i;
                itemType = 16;
                break;
            } else if (value > possibility['ORANGE_THUNDER'] && value < possibility['RED_THUNDER']) {
                itemIndex = i;
                itemType = 17;
                break;
            } else if (value > possibility['THUNDER']) {
                itemIndex = i;
                itemType = 14;
                break;
            } else {

            }
        }

        block.setItem(itemIndex, itemType);
        return block;
    }
}
