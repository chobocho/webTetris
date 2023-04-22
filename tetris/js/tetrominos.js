class Tetrominos {
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
  }

  getType() {
      return this.type;
  }

  getX(){
      return this.x;
  }

  getY(){
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
}

class EmptyBlock extends Tetrominos {
  constructor(bw, bh) {
    super(bw, bh);
    this.type = 0;
  }
}

class OBlock extends Tetrominos {
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

class IBlock extends Tetrominos {
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

class LBlock extends Tetrominos {
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

class JBlock extends Tetrominos {
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

class TBlock extends Tetrominos {
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

class SBlock extends Tetrominos {
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

class ZBlock extends Tetrominos {
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
  constructor () {
  }
  
  create() {
     return this.getBlock (Math.floor(Math.random()*7)+1);
  }

  getBlock(type) {
      switch(type) {
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
              console.log("Tetris Block Create Error! Never come to here!");
              return new ITetrominos();
      }
  }

  getEmptyBlock() {
    return new EmptyBlock();
  }
}

class ItemTetrisBlockFactory extends TetrisBlockFactory {
    constructor () {
        super();
    }

    create() {
        let block = this.getBlock (Math.floor(Math.random()*7)+1);
        return this._addItem(block);
    }

    _addItem(block) {
        let item = [0, ];
        let possibility = {'G': 0.012, 'BLUE': 0.05, 'R': 0.12};

        for (let i = 0; i < 4; i++) {
            let value = Math.random();
            if (value < possibility['G']) {
                item.push((11))
            } else if (value < possibility['BLUE']) {
                item.push((10))
            } else if (value < possibility['R']) {
                item.push(12);
            } else {
                item.push(1);
            }
        }

        for (let r = 0; r < 4; r++) {
            for (let y = 0; y < block.h; y++) {
                for (let x = 0; x < block.w; x++) {
                    block.block[r][y][x] = item[block.block[r][y][x]];
                }
            }
        }
        return block;
    }
}
