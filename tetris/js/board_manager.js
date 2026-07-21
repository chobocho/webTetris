class BoardManager {
    constructor() {
        this._board = undefined;
        this._index = 0;
    }

    init() {
        this._index = 0;
    }

    getIndex() {
        return this._index;
    }

    setIndex(index) {
        this._index = index;
    }

    setBoard(board) {
        this._board = board;
    }

    updateBoard() {

    }

    setMapData(data) {
        this.mapData = data.map(capMapHeight);
    }

    isArcadeMode() {
        return true;
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

        for (let y = board_height - 1; y >= 0; y--) {
            let count = 0;
            for (let x = 0; x < board_width; x++) {
                if (board[y][x] === 0) {
                    break;
                }
                count++;
            }

            if (count === board_width) {
                gFX.onLineClear(y, board[y].slice());
                removedLine++;
                for (let x = 0; x < board_width; x++) {
                    let m = 0;
                    for (m = y; m > 0; m--) {
                        board[m][x] = board[m - 1][x];
                    }
                    board[m][x] = 0;
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
    }

    updateBoard() {
        this._board.setColorBoardWithInt(this.mapData[this._index]);
        this.nextBoard();
    }

    // Load a specific level's picture without advancing the index (level select).
    loadLevel(index) {
        this._index = index;
        this._board.setColorBoardWithInt(this.mapData[index]);
    }

    nextBoard() {
        this._index++;
        if (this._index >= this.mapData.length) {
            this._index = 0;
        }
        console.log("[PuzzleBoardManager] " + this._index);
    }

    isArcadeMode() {
        return false;
    }

    isPuzzleMode() {
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
}
