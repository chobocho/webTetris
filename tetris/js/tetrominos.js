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
    this.block = [[[1, 1], [1, 1]]];
    this.x = 4;
    this.y = 0;
    this.r = 0;
    this.w = 2;
    this.h = 2;
    this.type = 1;
    this.numOfBlockType = 1;
  }

  rotate() {
    this.r = 0;
  }
}

class IBlock extends Tetrominos {
  constructor(bw, bh) {
    super(bw, bh);
    this.block = [[[1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0]],
    [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]];
    this.x = 5;
    this.y = 0;
    this.r = 0;
    this.w = 4;
    this.h = 4;
    this.type = 2;
    this.numOfBlockType = 2;
  }
}

class LBlock extends Tetrominos {
  constructor(bw, bh) {
    super(bw, bh);
    this.block = [
      [[1, 0, 0], 
       [1, 0, 0], 
       [1, 1, 0]],
      [[1, 1, 1], 
       [1, 0, 0], 
       [0, 0, 0]],
      [[1, 1, 0], 
       [0, 1, 0], 
       [0, 1, 0]],
      [[0, 0, 0], 
       [0, 0, 1], 
       [1, 1, 1]],
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
      [[0, 1, 0], 
       [0, 1, 0], 
       [1, 1, 0]],
      [[1, 0, 0], 
       [1, 1, 1], 
       [0, 0, 0]],
      [[1, 1, 0], 
       [1, 0, 0], 
       [1, 0, 0]],
      [[1, 1, 1], 
       [0, 0, 1], 
       [0, 0, 0]],
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
      [[1, 0, 0], 
       [1, 1, 0], 
       [1, 0, 0]],
      [[1, 1, 1], 
       [0, 1, 0], 
       [0, 0, 0]],
      [[0, 1, 0], 
       [1, 1, 0], 
       [0, 1, 0]],
      [[0, 1, 0], 
       [1, 1, 1], 
       [0, 0, 0]],
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
      [[0, 1, 1], 
       [1, 1, 0], 
       [0, 0, 0]],
      [[1, 0, 0], 
       [1, 1, 0], 
       [0, 1, 0]]
];
    this.x = 4;
    this.y = 0;
    this.r = 0;
    this.w = 3;
    this.h = 3;
    this.type = 6;
    this.numOfBlockType = 2;
  }
}

class ZBlock extends Tetrominos {
  constructor(bw, bh) {
    super(bw, bh);
    this.block = [
      [[1, 1, 0], 
       [0, 1, 1], 
       [0, 0, 0]],
      [[0, 1, 0], 
       [1, 1, 0], 
       [1, 0, 0]]
];
    this.x = 4;
    this.y = 0;
    this.r = 0;
    this.w = 3;
    this.h = 3;
    this.type = 7;
    this.numOfBlockType = 2;
  }
}

class TetrominosFactory {
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
              console.log("Tetrominos Create Error! Never come to here!");
              return new ITetrominos();
      }
  }

  getEmptyBlock() {
    return new EmptyBlock();
  }
}