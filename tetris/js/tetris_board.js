class BoardManager {
  constructor() {
    this.level = 0;
    this.highLevel = 0;
    this._board = NaN;
  }

  solve() {
     return false;
   }

   setBoard(board) {
    this._board = board;
   }

   updateBoard() {

   }

   setMapData(data) {
     this.mapData = data;
   }

   isPuzzleMode() {
    return false;
   }

   isItemMode() {
    return false;
   }

   isSolve() {
    return false;
   }
}

class PuzzleBoardManager extends BoardManager {
  constructor() {
    super();
    this._index = 0;
  }

  solve() {
    if (this._board == NaN) {
      return false;
    }
    return false;
  }

  updateBoard() {
    if (this._board == NaN) {
      console.log("[PuzzleBoardManager]: Board is Nan");
      return false;
    }
    this._board.setColorBoardWithInt(this.mapData[this._index]);
    this.nextBoard();
  }

  nextBoard() {
    this._index++;
    if (this._index >= this.mapData.length) {
      this._index = 0;
    }
    console.log("[PuzzleBoardManager] " + this._index);
  }

  isPuzzleMode() {
    return true;
  }

  isSolve() {
    if (this._board == NaN) {
      console.log("PuzzleBoardManager [isSolve]: Board is Nan");
      return false;
    }
    return this._board.isSolve();
  }
}

class ItemBoardManager extends BoardManager {
  constructor() {
    super();
    this._index = 0;
  }

  solve() {
    if (this._board == NaN) {
      return false;
    }
    return false;
  }

  updateBoard() {
    if (this._board == NaN) {
      console.log("[ItemBoardManager]: Board is Nan");
      return false;
    }
    this._board.setColorBoardWithItem(this.mapData[this._index]);
    this.nextBoard();
  }

  nextBoard() {
    this._index++;
    if (this._index >= this.mapData.length) {
      this._index = 0;
    }
    console.log("[ItemBoardManager] " + this._index);
  }

  isItemMode() {
    return true;
  }

  isSolve() {
    if (this._board == NaN) {
      console.log("ItemBoardManager [isSolve]: Board is Nan");
      return false;
    }
    return this._board.isSolve();
  }

  setMapData(board) {
    this.mapData = [];
    this.mapData.push(board[0]);
    let tmpBoard = [];
    for (let i = 1; i < board.length; i++) {
      tmpBoard.push(board[i]);
    }
    tmpBoard.sort(() => Math.random() - 0.5);
    tmpBoard.forEach( e => this.mapData.push(e));
    console.log("[ItemBoardManager][isSolve]: setMapData> " + this.mapData.length);
  }
}


class TetrisBoard {
  constructor(width, height, boardManager) {
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

  setColorBoardWithInt(data) {
    for (let i = 0; i < this.height; i++) {
      if (i in data) {
        let line = data[i];
        for (let j = 0; j < this.width; j++) {
          this.board[i][j] = (line >> (j * 3)) & 0x7;
        }
      }
    }
  }

  setColorBoardWithItem(data) {
    for (let i = 0; i < this.height; i++) {
      if (i in data) {
        let line = data[i];
        for (let j = 0; j < this.width; j++) {
          this.board[i][j] = (line >> (j * 3)) & 0x7;
          if (this.board[i][j] > 0 && Math.random() > 0.92) {
            this.board[i][j] = 9;
          }
        }
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
        if (block.block[block.r][i][j] !== 0) {
          if (block.x + j < 0 || (block.x + j) > (this.width - 1) || (block.y + i) > (this.height - 1)) {
            return false;
          }
          if (this.board[block.y + i][block.x + j] !== 0) {
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
        // Check is it a item block
        if (block.block[block.r][i][j] >= START_BOOM && block.block[block.r][i][j] <= END_BOOM) {
          this.board[i + block.y][j + block.x] = block.block[block.r][i][j];
        } else if (block.block[block.r][i][j] !== 0) {
          this.board[i + block.y][j + block.x] = FIXED_BLOCK;
        }
      }
    }
  }

  handleBoom() {
    this._handleGreenBoom();
    this._handleOrangeBoom();
    this._handleRedBoom();
    this._handleBlueBoom();
    this._handleThunder();
    this._handleBlackBoom();
  }

  _handleOrangeBoom() {
    let hasBoom = false;
    let ORANGE = 13;

    for (let y = this.height-1; y >= 0; y--) {
      hasBoom = false;
      let x = 0;

      for (x = 0; x < this.width; x++) {
        if (this.board[y][x] === 0) {
          break;
        }
      }

      let skipLine = (x === this.width);

      for (x = 0; x < this.width; x++) {
        if (this.board[y][x] === ORANGE) {
          this.board[y][x] = FIXED_BLOCK;
          hasBoom = true;
          break;
        }
      }

      if (hasBoom) {
        for (let ty = y-1; ty <= y+1; ty++) {
          if (ty < 0 || ty >= this.height) {
            continue;
          }

          if (skipLine && ty == y) {
            continue;
          }

          for (let tx = x-1; tx <= x+1; tx++) {
            if (tx < 0 || tx >= this.width) {
              continue;
            }
            if (this.board[ty][tx] < START_BOOM || this.board[ty][tx] > END_BOOM) {
              this.board[ty][tx] = 0;
            }
          }
        }
        y--;
      }
    }
    //console.log("[handleBoom] " + this.board);
  }

  _handleGreenBoom() {
    let hasBoom = false;
    let GREEN = 11;
    let pattern = [
        [0,0,1,0,0],
        [0,1,0,1,0],
        [1,0,1,0,1],
        [0,1,0,1,0],
        [0,0,1,0,0]
    ];

    for (let y = this.height-1; y >= 0; y--) {
      hasBoom = false;
      let x = 0;
      for (x = 0; x < this.width; x++) {
        if (this.board[y][x] === 0) {
          break;
        }
      }

      let skipLine = (x === this.width);

      for (x = 0; x < this.width; x++) {
        if (this.board[y][x] === GREEN) {
          this.board[y][x] = FIXED_BLOCK;
          hasBoom = true;
          break;
        }
      }

      if (hasBoom) {
        for (let ty = y-2, j = 0; ty <= y+2; ty++, j++) {
          if (ty < 0 || ty >= this.height) {
            continue;
          }
          if (skipLine && ty == y) {
            continue;
          }
          for (let tx = x-2, i = 0; tx <= x+2; tx++, i++) {
            if (tx < 0 || tx >= this.width) {
              continue;
            }
            if (this.board[ty][tx] < START_BOOM || this.board[ty][tx] > END_BOOM) {
              if (pattern[j][i] === 1) {
                this.board[ty][tx] = FIXED_BLOCK;
              } else {
                this.board[ty][tx] = 0;
              }
            }
          }
        }
        y--;
      }
    }
    //console.log("[handleBoom] " + this.board);
  }

  _handleBlueBoom() {
    let hasBoom = false;
    let BLUE = 10;

    for (let y = this.height-1; y >= 0; y--) {
      hasBoom = false;
      let x = 0;
      for (x = 0; x < this.width; x++) {
        if (this.board[y][x] === BLUE) {
          this.board[y][x] = FIXED_BLOCK;
          hasBoom = true;
          break;
        }
      }

      if (hasBoom) {
        for (let ty = y-1; ty <= y+1; ty++) {
          if (ty < 0 || ty >= this.height) {
            continue;
          }
          for (let tx = x-1; tx <= x+1; tx++) {
            if (tx < 0 || tx >= this.width) {
              continue;
            }
            if (this.board[ty][tx] < START_BOOM || this.board[ty][tx] > END_BOOM) {
              this.board[ty][tx] = FIXED_BLOCK;
            }
          }
        }
        y--;
      }
    }
    //console.log("[handleBoom] " + this.board);
  }

  _handleRedBoom() {
    let hasBoom = false;
    const RED = 12;
    for (let y = this.height - 1; y >= 0; y--) {
      hasBoom = false;
      for (let x = 0; x < this.width; x++) {
        if (this.board[y][x] === RED) {
          this.board[y][x] = FIXED_BLOCK;
          hasBoom = true;
          break;
        }
      }

      if (hasBoom) {
        for (let tx = 0; tx < this.width; tx++) {
          if (this.board[y][tx] < START_BOOM || this.board[y][tx] > END_BOOM) {
            this.board[y][tx] = FIXED_BLOCK;
          }
        }
      }
    }
  }

  _handleBlackBoom() {
    let hasBoom = false;
    const BOOM = 9;
    for (let y = this.height-1; y >= 0; y--) {
      let count = 0;
      hasBoom = false;
      for (let x = 0; x < this.width; x++) {
        if (this.board[y][x] !== 0) {
          count++;
        }
        if (this.board[y][x] === BOOM) {
          hasBoom = true;
        }
      }

      if ((count === this.width) && hasBoom) {
         for (let ty = y-1; ty <= y+1; ty++) {
           if (ty < 0 || ty >= this.height) {
             continue;
           }
           for (let tx = 0; tx < this.width; tx++) {
             if (this.board[ty][tx] < START_BOOM || this.board[ty][tx] > END_BOOM) {
               this.board[ty][tx] = FIXED_BLOCK;
             }
           }
         }
      }
    }
    //console.log("[handleBoom] " + this.board);
  }

  _handleThunder() {
    let hasBoom = false;
    let hasThunder = false;
    const BLACK = 9;
    const THUNDER = 14;

    for (let y = this.height - 1; !hasThunder && y >= 0; y--) {
      for (let x = 0; x < this.width; x++) {
        if (this.board[y][x] === THUNDER) {
          this.board[y][x] = FIXED_BLOCK;
          hasThunder = true;
          break;
        }
      }
    }

    if (!hasThunder) {
      return;
    }

    for (let y = this.height - 1; y >= 0; y--) {
      hasBoom = false;
      for (let x = 0; x < this.width; x++) {
        if (this.board[y][x] === BLACK) {
          hasBoom = true;
          break;
        }
      }

      if (hasBoom) {
        for (let tx = 0; tx < this.width; tx++) {
          if (this.board[y][tx] < START_BOOM || this.board[y][tx] > END_BOOM) {
            this.board[y][tx] = FIXED_BLOCK;
          }
        }
      }
    }
  }

  arrange() {
    let removedLine = 0;

    for (let y = this.height-1; y >= 0; y--) {
        let count = 0;
        for (let x = 0; x < 10; x++) {
            if (this.board[y][x] !== 0) {
                count++;
            }
        }

        if (count === this.width) {
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

  isSolve() {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        if (this.board[i][j] >= 1 && this.board[i][j] <= 7) {
          console.log("[Board][isSolve] Fail: " + i + ", " + j);
          return false;
        }
      }
    }
    return true;
  }
}
