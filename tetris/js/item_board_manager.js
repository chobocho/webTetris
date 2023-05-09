class ItemBoardManager extends BoardManager {
    constructor() {
        super();
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

    isArcadeMode() {
        return false;
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
        tmpBoard.forEach(e => this.mapData.push(e));
        console.log("[ItemBoardManager][isSolve]: setMapData> " + this.mapData.length);
    }

    arrange(board) {
        let removedLines = this._arrange(board);
        this._handleBlackThunder(board);
        this._handleOrangeThunder(board);
        this._handleRedThunder(board);
        this._handleGreenBoom(board);
        this._handleOrangeBoom(board);
        this._handleRedBoom(board);
        this._handleBlueBoom(board);
        this._handleThunder(board);
        this._handleBlackBoom(board);

        removedLines += this._arrange(board);
        let tmpRemoveLines = 1;
        let maxCount = 100;
        while (maxCount > 0 && tmpRemoveLines > 0) {
            maxCount--;
            this._handleBlackBoom(board);
            tmpRemoveLines = this._arrange(board);
            removedLines += tmpRemoveLines;
        }
        if (maxCount === 0) {
            console.log("[ItemBoardManager] Error maxCount is 0");
        } else {
            console.log("[ItemBoardManager] maxCount is " + maxCount);
        }
        return removedLines;
    }

    _handleRedBoom(board) {
        const height = board_height;
        const width = board_width;
        const RED = 12;
        let hasBoom = false;
        let boomCount = 0;

        this._board.insertEffect();

        for (let y = height - 1; y >= 0; y--) {
            hasBoom = false;
            for (let x = 0; x < width; x++) {
                if (board[y][x] === RED) {
                    board[y][x] = FIXED_BLOCK;
                    hasBoom = true;
                    boomCount++;
                }
            }

            if (hasBoom) {
                for (let tx = 0; tx < width; tx++) {
                    if (board[y][tx] < START_BOOM || board[y][tx] > END_BOOM) {
                        board[y][tx] = FIXED_BLOCK;
                    }
                }
            }
        }

        if (boomCount === 0) {
            this._board.popEffect();
        }
    }

    _handleBlackBoom(board) {
        const height = board_height;
        const width = board_width;
        const BOOM = 9;
        let hasBoom = false;
        let boomCount = 0;

        this._board.insertEffect();

        for (let y = height - 1; y >= 0; y--) {
            let count = 0;
            hasBoom = false;
            for (let x = 0; x < width; x++) {
                if (board[y][x] !== 0) {
                    count++;
                }
                if (board[y][x] === BOOM) {
                    hasBoom = true;
                }
            }

            if ((count === width) && hasBoom) {
                boomCount++;

                for (let ty = y - 1; ty <= y + 1; ty++) {
                    if (ty < 0 || ty >= height) {
                        continue;
                    }
                    for (let tx = 0; tx < width; tx++) {
                        if (board[ty][tx] < START_BOOM || board[ty][tx] > END_BOOM) {
                            board[ty][tx] = FIXED_BLOCK;
                        }
                        if (ty === y && board[ty][tx] === BOOM) {
                            board[y][tx] = FIXED_BLOCK;
                        }
                    }
                }
                this._board.insertEffect();
            }
        }

        if (boomCount === 0) {
            this._board.popEffect();
        }
        //console.log("[handleBoom] " + board);
    }

    _handleThunder(board) {
        const height = board_height;
        const width = board_width;
        const BLACK = 9;
        const THUNDER = 14;
        let hasBoom = false;
        let hasThunder = false;
        let boomCount = 0;

        this._board.insertEffect();

        for (let y = height - 1; !hasThunder && y >= 0; y--) {
            for (let x = 0; x < width; x++) {
                if (board[y][x] === THUNDER) {
                    board[y][x] = FIXED_BLOCK;
                    hasThunder = true;
                    break;
                }
            }
        }

        if (!hasThunder) {
            return;
        }

        for (let y = height - 1; y >= 0; y--) {
            hasBoom = false;
            for (let x = 0; x < width; x++) {
                if (board[y][x] === BLACK) {
                    hasBoom = true;
                    boomCount++;
                    break;
                }
            }

            if (hasBoom) {
                for (let tx = 0; tx < width; tx++) {
                    if (board[y][tx] < START_BOOM || board[y][tx] > END_BOOM) {
                        board[y][tx] = FIXED_BLOCK;
                    }
                }
            }
        }

        if (boomCount === 0) {
            this._board.popEffect();
        }

    }

    _handleBlueBoom(board) {
        const height = board_height;
        const width = board_width;
        const BLUE = 10;
        let hasBoom = false;
        let boomCount = 0;

        this._board.insertEffect();

        for (let y = height - 1; y >= 0; y--) {
            hasBoom = false;
            let x = 0;
            for (x = 0; x < width; x++) {
                if (board[y][x] === BLUE) {
                    board[y][x] = FIXED_BLOCK;
                    hasBoom = true;
                    boomCount++;
                    break;
                }
            }

            if (hasBoom) {
                for (let ty = y - 1; ty <= y + 1; ty++) {
                    if (ty < 0 || ty >= height) {
                        continue;
                    }
                    for (let tx = x - 1; tx <= x + 1; tx++) {
                        if (tx < 0 || tx >= width) {
                            continue;
                        }
                        if (board[ty][tx] < START_BOOM || board[ty][tx] > END_BOOM) {
                            board[ty][tx] = FIXED_BLOCK;
                        }
                    }
                }
                y++;
            }
        }

        if (boomCount === 0) {
            this._board.popEffect();
        }
        //console.log("[handleBoom] " + board);
    }


    _handleGreenBoom(board) {
        const height = board_height;
        const width = board_width;
        const GREEN = 11;
        let hasBoom = false;
        let boomCount = 0;

        const boomPattern = [
          [0, 0, 1, 0, 0],
          [0, 1, 1, 1, 0],
          [1, 1, 1, 1, 1],
          [0, 1, 1, 1, 0],
          [0, 0, 1, 0, 0]
        ];

        const pattern = [
            [0, 0, 1, 0, 0],
            [0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1],
            [0, 1, 0, 1, 0],
            [0, 0, 1, 0, 0]
        ];

      function applyPattern(y, skipLine, x, pattern) {
        for (let ty = y - 2, j = 0; ty <= y + 2; ty++, j++) {
          if (ty < 0 || ty >= height) {
            continue;
          }
          if (skipLine && ty === y) {
            continue;
          }
          for (let tx = x - 2, i = 0; tx <= x + 2; tx++, i++) {
            if (tx < 0 || tx >= width) {
              continue;
            }
            if (pattern[j][i] === 1) {
              board[ty][tx] = FIXED_BLOCK;
            } else {
              board[ty][tx] = 0;
            }
          }
        }
      }


      this._board.insertEffect();

       for (let y = height - 1; y >= 0; y--) {
            hasBoom = false;
            let x = 0;
            for (x = 0; x < width; x++) {
                if (board[y][x] === 0) {
                    break;
                }
            }

            let skipLine = (x === width);

            for (x = 0; x < width; x++) {
                if (board[y][x] === GREEN) {
                    board[y][x] = FIXED_BLOCK;
                    hasBoom = true;
                    boomCount++;
                    break;
                }
            }

            if (hasBoom) {
              applyPattern(y, skipLine, x, boomPattern);
              this._board.insertEffect();
              applyPattern(y, skipLine, x, pattern);
              y++;
            }
        }

        if (boomCount === 0) {
            this._board.popEffect();
        }

        //console.log("[handleBoom] " + board);
    }

    _handleOrangeBoom(board) {
        const height = board_height;
        const width = board_width;
        const ORANGE = 13;
        let hasBoom = false;
        let boomCount = 0;
        let pattern = [
            [1, 1, 1],
            [1, 0, 1],
            [1, 1, 1],
        ];

        this._board.insertEffect();

        for (let y = height - 1; y >= 0; y--) {
            hasBoom = false;
            let x = 0;

            for (x = 0; x < width; x++) {
                if (board[y][x] === 0) {
                    break;
                }
            }

            let skipLine = (x === width);

            for (x = 0; x < width; x++) {
                if (board[y][x] === ORANGE) {
                    board[y][x] = FIXED_BLOCK;
                    hasBoom = true;
                    boomCount++;
                    break;
                }
            }

            if (hasBoom) {
                for (let ty = y - 1, j = 0; ty <= y + 1; ty++, j++) {
                    if (ty < 0 || ty >= height) {
                        continue;
                    }
                    if (skipLine && ty === y) {
                        continue;
                    }
                    for (let tx = x - 1, i = 0; tx <= x + 1; tx++, i++) {
                        if (tx < 0 || tx >= width) {
                            continue;
                        }
                        if (pattern[j][i] === 1) {
                            board[ty][tx] = FIXED_BLOCK;
                        } else {
                            board[ty][tx] = 0;
                        }
                    }
                }
                y++;
            }
        }

        if (boomCount === 0) {
            this._board.popEffect();
        }
        //console.log("[handleBoom] " + board);
    }

    _handleBlackThunder(board) {
        const height = board_height;
        const width = board_width;
        const BLACK_THUNDER = 15;
        let hasBoom = false;
        let boomCount = 0;

        this._board.insertEffect();

        for (let y = height - 1; y >= 0; y--) {
            hasBoom = false;
            let x = 0;
            for (x = 0; x < width; x++) {
                if (board[y][x] === BLACK_THUNDER) {
                    board[y][x] = FIXED_BLOCK;
                    hasBoom = true;
                }
            }

            if (hasBoom) {
                for (let ty = 0, boomCount = 0; ty < height && boomCount < 3; ty++) {
                    for (let tx = 0; tx < width; tx++) {
                        if (board[ty][tx] !== 0 &&
                            (board[ty][tx] < START_BOOM || board[ty][tx] > END_BOOM)) {
                            if (Math.random() < 0.1 && boomCount < 3) {
                                board[ty][tx] = START_BOOM;
                                boomCount++;
                            }
                        }
                    }
                }
                y++;
            }
            // console.log("[BlackThunder] " + x + ',' + y);
        }

        if (boomCount === 0) {
            this._board.popEffect();
        }
    }


    _handleRedThunder(board) {
        const height = board_height;
        const width = board_width;
        const RED_THUNDER = 17;
        let hasBoom = false;
        let boomCount = 0;

        this._board.insertEffect();

        for (let y = height - 1; y >= 0; y--) {
            hasBoom = false;
            let x = 0;
            for (x = 0; x < width; x++) {
                if (board[y][x] === RED_THUNDER) {
                    board[y][x] = 0;
                    hasBoom = true;
                    boomCount++;
                    break;
                }
            }

            if (hasBoom) {
                for (let ty = 0; ty < height; ty++) {
                    for (let tx = x; tx < x + 2; tx++) {
                        if (tx >= width) {
                            continue;
                        }
                        board[ty][tx] = FIXED_BLOCK;
                    }
                }
                this._board.insertEffect();

                for (let ty = 0; ty < height; ty++) {
                    for (let tx = x; tx < x + 2; tx++) {
                        if (tx >= width) {
                            continue;
                        }
                        board[ty][tx] = 0;
                    }
                }
                y++;
            }
        }

        if (boomCount === 0) {
            this._board.popEffect();
        }
    }

    _handleOrangeThunder(board) {
        const height = board_height;
        const width = board_width;
        const ORANGE_THUNDER = 16;
        let hasBoom = false;
        let boomCount = 0;

        this._board.insertEffect();

        for (let y = height - 1; y >= 0; y--) {
            hasBoom = false;
            let x = 0;
            for (x = 0; x < width; x++) {
                if (board[y][x] === ORANGE_THUNDER) {
                    board[y][x] = FIXED_BLOCK;
                    hasBoom = true;
                    boomCount++;
                    break;
                }
            }

            if (hasBoom) {
                for (let ty = y - 1; ty <= y + 1; ty++) {
                    if (ty < 0 || ty >= height) {
                        continue;
                    }
                    for (let tx = x - 1; tx <= x + 1; tx++) {
                        if (tx < 0 || tx >= width) {
                            continue;
                        }
                        board[ty][tx] = FIXED_BLOCK;
                    }
                }
                this._board.insertEffect();

                for (let ty = y - 1; ty <= y + 1; ty++) {
                    if (ty < 0 || ty >= height) {
                        continue;
                    }
                    for (let tx = x - 1; tx <= x + 1; tx++) {
                        if (tx < 0 || tx >= width) {
                            continue;
                        }
                        board[ty][tx] = 0;
                    }
                }
                y++;
            }
        }

        if (boomCount === 0) {
            this._board.popEffect();
        }
        //console.log("[handleBoom] " + board);
    }


    _arrange(board) {
        let removedLine = 0;
        const GREEN = 11;
        const ORANGE_BOOM = 13;
        const ORANGE_THUNDER = 16;

        for (let y = board_height - 1; y >= 0; y--) {
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
                        board[m][x] = board[m - 1][x];
                    }
                    board[m][0] = 0;
                }
                y++;
            }
        }

        return removedLine;
    }
}
