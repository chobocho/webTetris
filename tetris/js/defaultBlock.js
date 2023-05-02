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
        this.itemIndex = 0;
        this.itemType = 0;
        this.wallKick = [];
        this.leftWallKick = [];
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

    applyWallKick(bx, by, wallKickIdx) {
        this.x = bx + this.wallKick[this.r][wallKickIdx][0];
        this.y = by + this.wallKick[this.r][wallKickIdx][1];
    }

    applyLeftWallKick(bx, by, wallKickIdx) {
        this.x = bx + this.leftWallKick[this.r][wallKickIdx][0];
        this.y = by + this.leftWallKick[this.r][wallKickIdx][1];
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
        this.wallKick = [
            [[0, 0]],
            [[0, 0]],
            [[0, 0]],
            [[0, 0]]
        ];
        this.leftWallKick = [
            [[0, 0]],
            [[0, 0]],
            [[0, 0]],
            [[0, 0]]
        ];
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
        this.wallKick = [
            [[0, 0], [-2, 0], [+1, 0], [-2, -1], [+1, +2]],
            [[0, 0], [-1, 0], [+2, 0], [-1, +2], [+2, -1]],
            [[0, 0], [+2, 0], [-1, 0], [+2, +1], [-1, -2]],
            [[0, 0], [+1, 0], [-2, 0], [+1, -2], [-2, +1]]
        ];
        this.leftWallKick = [
            [[0, 0], [-1, 0], [+2, 0], [-1, +2], [+2, -1]],
            [[0, 0], [-2, 0], [+1, 0], [-2, -1], [+1, +2]],
            [[0, 0], [+1, 0], [-2, 0], [+1, -2], [-2, +1]],
            [[0, 0], [+2, 0], [-1, 0], [+2, +1], [-1, -2]]
        ];
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
        this.wallKick = [
            [[0, 0], [-1, 0], [-1, +1], [0, -2], [-1, -2]],
            [[0, 0], [+1, 0], [+1, -1], [0, +2], [+1, +2]],
            [[0, 0], [+1, 0], [+1, +1], [0, -2], [+1, -2]],
            [[0, 0], [-1, 0], [-1, -1], [0, +2], [-1, +2]],
        ];
        this.leftWallKick = [
            [[0, 0], [+1, 0], [+1, +1], [0, -2], [+1, -2]],
            [[0, 0], [-1, 0], [-1, -1], [0, +2], [-1, +2]],
            [[0, 0], [-1, 0], [-1, +1], [0, -2], [-1, -2]],
            [[0, 0], [+1, 0], [+1, -1], [0, +2], [+1, +2]],
        ];
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
        this.wallKick = [
            [[0, 0], [-1, 0], [-1, +1], [0, -2], [-1, -2]],
            [[0, 0], [+1, 0], [+1, -1], [0, +2], [+1, +2]],
            [[0, 0], [+1, 0], [+1, +1], [0, -2], [+1, -2]],
            [[0, 0], [-1, 0], [-1, -1], [0, +2], [-1, +2]],
        ];
        this.leftWallKick = [
            [[0, 0], [+1, 0], [+1, +1], [0, -2], [+1, -2]],
            [[0, 0], [-1, 0], [-1, -1], [0, +2], [-1, +2]],
            [[0, 0], [-1, 0], [-1, +1], [0, -2], [-1, -2]],
            [[0, 0], [+1, 0], [+1, -1], [0, +2], [+1, +2]],
        ];
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
        this.wallKick = [
            [[0, 0], [-1, 0], [-1, +1], [0, -2], [-1, -2]],
            [[0, 0], [+1, 0], [+1, -1], [0, +2], [+1, +2]],
            [[0, 0], [+1, 0], [+1, +1], [0, -2], [+1, -2]],
            [[0, 0], [-1, 0], [-1, -1], [0, +2], [-1, +2]],
        ];
        this.leftWallKick = [
            [[0, 0], [+1, 0], [+1, +1], [0, -2], [+1, -2]],
            [[0, 0], [-1, 0], [-1, -1], [0, +2], [-1, +2]],
            [[0, 0], [-1, 0], [-1, +1], [0, -2], [-1, -2]],
            [[0, 0], [+1, 0], [+1, -1], [0, +2], [+1, +2]],
        ];
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
        this.wallKick = [
            [[0, 0], [-1, 0], [-1, +1], [0, -2], [-1, -2]],
            [[0, 0], [+1, 0], [+1, -1], [0, +2], [+1, +2]],
            [[0, 0], [+1, 0], [+1, +1], [0, -2], [+1, -2]],
            [[0, 0], [-1, 0], [-1, -1], [0, +2], [-1, +2]],
        ];
        this.leftWallKick = [
            [[0, 0], [+1, 0], [+1, +1], [0, -2], [+1, -2]],
            [[0, 0], [-1, 0], [-1, -1], [0, +2], [-1, +2]],
            [[0, 0], [-1, 0], [-1, +1], [0, -2], [-1, -2]],
            [[0, 0], [+1, 0], [+1, -1], [0, +2], [+1, +2]],
        ];
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
        this.wallKick = [
            [[0, 0], [-1, 0], [-1, +1], [0, -2], [-1, -2]],
            [[0, 0], [+1, 0], [+1, -1], [0, +2], [+1, +2]],
            [[0, 0], [+1, 0], [+1, +1], [0, -2], [+1, -2]],
            [[0, 0], [-1, 0], [-1, -1], [0, +2], [-1, +2]],
        ];
        this.leftWallKick = [
            [[0, 0], [+1, 0], [+1, +1], [0, -2], [+1, -2]],
            [[0, 0], [-1, 0], [-1, -1], [0, +2], [-1, +2]],
            [[0, 0], [-1, 0], [-1, +1], [0, -2], [-1, -2]],
            [[0, 0], [+1, 0], [+1, -1], [0, +2], [+1, +2]],
        ];
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
        return Math.random() > 0.12 ? this._addItem(block) : block;
    }

    generateItemType(value, possibility) {
        if (value < possibility['GREEN']) {
            return 11;
        } else if (value < possibility['BLUE']) {
            return 10;
        } else if (value < possibility['ORANGE']) {
            return 13;
        } else if (value < possibility['RED']) {
            return 12;
        } else if (value < possibility['BLACK']) {
            return 9;
        } else if (value < possibility['BLACK_THUNDER']) {
            return 15;
        } else if (value < possibility['ORANGE_THUNDER']) {
            return 16;
        } else if (value < possibility['RED_THUNDER']) {
            return 17;
        } else if (value < possibility['THUNDER']) {
            return 14;
        }
        return 0;
    }

    _addItem(block) {
        const possibility = {
            'GREEN': 32,
            'BLUE': 512,
            'ORANGE': 912,
            'RED': 1312,
            'BLACK': 1412,
            'BLACK_THUNDER': 1512,
            'ORANGE_THUNDER': 1662,
            'RED_THUNDER': 1762,
            'THUNDER': 1812
        };

        let itemIndex = 0;
        let itemType = 0;

        for (let i = 1; i <= 4; i++) {
            const value = Math.floor(Math.random() * 10000);
            itemType = this.generateItemType(value, possibility);
            if (itemType > 0) {
                itemIndex = i;
                break;
            }
        }

        block.setItem(itemIndex, itemType);
        return block;
    }
}
