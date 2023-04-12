class BoardManager {
  constructor() {
      this.level = 0;
      this.highLevel = 0;
  }

  solve() {
     return false;
   }
}

class TetrisBoard {
  constructor(width, height) {
    this.board = [];
    this.width = width;
    this.height = height;

    for (let i = 0; i < height; i++) {
      this.board.push(new Array(10).fill(0));
    }

    this.init();
  }

  init() {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        this.board[i][j] = 0;
      }
    }
  }

  get() {
    return this.board;
  }

  set(gameInfo) {
    for (let i = 0; i < this.height; i++) {
      let line = gameInfo['board'][i];
      for (let j = 0; j < this.width; j++) {
        this.board[i][j] = (line >> j) & 0x1;
      }
    }
  }

  getBoard() {
    let result = [];
    for (let i = 0; i < this.height; i++) {
      let line = 0;
      for (let j = 0; j < this.width; j++) {
        if (this.board[i][j] > 0) {
          line |= (1 << j);
        }
      }
      result.push(line);
    }
    return result;
  }

  isAcceptable(block) {
    for (let i = 0; i < block.h; i++) {
      for (let j = 0; j < block.w; j++) {
        if (block.block[block.r][i][j] != 0) {
          if (block.x < 0 || (block.x + j) > (this.width - 1) || (block.y + i) > (this.height - 1)) {
            return false;
          }
          if (this.board[block.y + i][block.x + j] != 0) {
            return false;
          }
        }
      }
    }
    return true;
  }

  addBlock(block) {
    for (let i = 0; i < block.h; i++) {
      for (let j = 0; j < block.w; j++) {
        if (block.block[block.r][i][j] != 0) {
          this.board[i + block.y][j + block.x] = block.type;
        }
      }
    }
  }

  arrange() {
    let removedLine = 0;

    for (let y = this.height-1; y >= 0; y--) {
        let count = 0;
        for (let x = 0; x < 10; x++) {
            if (this.board[y][x] != 0) {
                count++;
            }
        }

        if (count == this.width) {
          removedLine++;
            for (let x = 0; x < this.width; x++) {
                let m = 0;
                for (m = y; m > 0; m--) {
                    this.board[m][x] = this.board[m - 1][x];
                }
                this.board[m][0] = 0;
            }
            y++;
        }
    }
    return removedLine;
  }
}
