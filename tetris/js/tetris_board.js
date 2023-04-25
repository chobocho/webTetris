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

   isSolve(board) {
    return false;
   }

  arrange(board) {
    let removedLine = 0;

    for (let y = board_height-1; y >= 0; y--) {
      let count = 0;
      for (let x = 0; x < board_width; x++) {
        if (board[y][x] === 0) {
          break;
        }
        count++;
      }

      if (count === board_width) {
        removedLine++;
        for (let x = 0; x < board_width; x++) {
          let m = 0;
          for (m = y; m > 0; m--) {
            board[m][x] = board[m-1][x];
          }
          board[m][0] = 0;
        }
        y++;
      }
    }
    return removedLine;
  }
}

class PuzzleBoardManager extends BoardManager {
  constructor() {
    super();
    this._index = 0;
  }

  updateBoard() {
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

  isSolve(board){
    for (let i = 0; i < board_height; i++) {
      for (let j = 0; j < board_width; j++) {
        if (board[i][j] >= 1 && board[i][j] <= 7) {
          console.log("[Board][isSolve] Fail: " + i + ", " + j);
          return false;
        }
      }
    }
    return true;
  }
}

class ItemBoardManager extends BoardManager {
  constructor() {
    super();
    this._index = 0;
  }

  updateBoard() {
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

  isSolve(board) {
    for (let i = 0; i < board_height; i++) {
      for (let j = 0; j < board_width; j++) {
        if (board[i][j] >= 1 && board[i][j] <= 7) {
          console.log("[Board][isSolve] Fail: " + i + ", " + j);
          return false;
        }
      }
    }
    return true;
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

  arrange(board) {
    let removedLine = 0;
    const GREEN = 11;
    const ORANGE_BOOM = 13;
    const ORANGE_THUNDER = 16;

    for (let y = board_height-1; y >= 0; y--) {
      let count = 0;
      for (let x = 0; x < board_width; x++) {
        if (board[y][x] === 0) {
          break;
        }
        if (board[y][x] >= START_BOOM && board[y][x] <= END_BOOM) {
          if (board[y][x] !== GREEN &&
              board[y][x] !== ORANGE_BOOM &&
              board[y][x] !== ORANGE_THUNDER
          ) {
            break;
          }
        }
        count++;
      }

      if (count === board_width) {
        removedLine++;
        for (let x = 0; x < board_width; x++) {
          let m = 0;
          for (m = y; m > 0; m--) {
            board[m][x] = board[m-1][x];
          }
          board[m][0] = 0;
        }
        y++;
      }
    }
    return removedLine;
  }
}


class TetrisBoard {
  constructor(width, height, boardManager) {
    this.board = [];
    this.width = width;
    this.height = height;
    this._boardManager = boardManager;

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
    let removedLines = this.arrange();
    this._handleBlackThunder();
    this._handleOrangeThunder();
    this._handleRedThunder();
    this._handleGreenBoom();
    this._handleOrangeBoom();
    this._handleRedBoom();
    this._handleBlueBoom();
    this._handleThunder();
    this._handleBlackBoom();

    removedLines += this.arrange();
    let tmpRemoveLines = 1;
    let maxCount = 100;
    while (maxCount > 0 && tmpRemoveLines > 0) {
      maxCount--;
      this._handleBlackBoom();
      tmpRemoveLines = this.arrange();
      removedLines += tmpRemoveLines;
    }
    if (maxCount === 0) {
      console.log("[BOARD][ITEM_MODE] Error maxCount is 0");
    } else {
      console.log("[BOARD][ITEM_MODE] maxCount is " + maxCount);
    }
    return removedLines;
  }

  _handleRedThunder() {
    let hasBoom = false;
    const RED_THUNDER = 17;
    for (let y = this.height - 1; y >= 0; y--) {
      hasBoom = false;
      let x = 0;
      for (x = 0; x < this.width; x++) {
        if (this.board[y][x] === RED_THUNDER) {
          this.board[y][x] = 0;
          hasBoom = true;
          break;
        }
      }

      if (hasBoom) {
        for (let ty = 0; ty < this.height; ty++) {
          for (let tx = x; tx < x+2; tx++) {
            if (tx >= this.width) {
              continue;
            }
            this.board[ty][tx] = 0;
          }
        }
        y++;
      }
    }
  }

  _handleBlackThunder() {
    let hasBoom = false;
    const BLACK_THUNDER = 15;
    for (let y = this.height - 1; y >= 0; y--) {
      hasBoom = false;
      let x = 0;
      for (x = 0; x < this.width; x++) {
        if (this.board[y][x] === BLACK_THUNDER) {
          this.board[y][x] = FIXED_BLOCK;
          hasBoom = true;
        }
      }

      if (hasBoom) {
        for (let ty = 0, boomCount = 0; ty < this.height && boomCount < 3; ty++) {
          for (let tx = 0; tx < this.width; tx++) {
            if (this.board[ty][tx] !== 0 &&
                (this.board[ty][tx] < START_BOOM ||this.board[ty][tx] > END_BOOM)) {
              if (Math.random() < 0.1 && boomCount < 3) {
                this.board[ty][tx] = START_BOOM;
                boomCount++;
              }
            }
          }
        }
        y++;
      }
      // console.log("[BlackThunder] " + x + ',' + y);
    }
  }

  _handleOrangeThunder() {
    let hasBoom = false;
    let ORANGE_THUNDER = 16;

    for (let y = this.height-1; y >= 0; y--) {
      hasBoom = false;
      let x = 0;
      for (x = 0; x < this.width; x++) {
        if (this.board[y][x] === ORANGE_THUNDER) {
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
            this.board[ty][tx] = 0;
          }
        }
        y++;
      }
    }
    //console.log("[handleBoom] " + this.board);
  }

  _handleOrangeBoom() {
    let hasBoom = false;
    let ORANGE = 13;
    let pattern = [
      [1,1,1],
      [1,0,1],
      [1,1,1],
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
        if (this.board[y][x] === ORANGE) {
          this.board[y][x] = FIXED_BLOCK;
          hasBoom = true;
          break;
        }
      }

      if (hasBoom) {
        for (let ty = y-1, j = 0; ty <= y+1; ty++, j++) {
          if (ty < 0 || ty >= this.height) {
            continue;
          }
          if (skipLine && ty === y) {
            continue;
          }
          for (let tx = x-1, i = 0; tx <= x+1; tx++, i++) {
            if (tx < 0 || tx >= this.width) {
              continue;
            }
            if (pattern[j][i] === 1) {
              this.board[ty][tx] = FIXED_BLOCK;
            } else {
              this.board[ty][tx] = 0;
            }
          }
        }
        y++;
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
          if (skipLine && ty === y) {
            continue;
          }
          for (let tx = x-2, i = 0; tx <= x+2; tx++, i++) {
            if (tx < 0 || tx >= this.width) {
              continue;
            }
            if (pattern[j][i] === 1) {
               this.board[ty][tx] = FIXED_BLOCK;
            } else {
               this.board[ty][tx] = 0;
            }
          }
        }
        y++;
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
        y++;
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
             if (ty === y && this.board[ty][tx] === BOOM) {
               this.board[y][tx] = FIXED_BLOCK;
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
      return this._boardManager.arrange(this.board);
  }

  isSolve() {
      return this._boardManager.isSolve(this.board);
  }
}
