function printf(tag, log) {
    console.log(tag, log);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function createEmptyBoard() {
    return {
        'version': 2,
        'gameState': 0,
        'score': 0,
        'next_next_block': 1,
        'next_block': 1,
        'hold_block': 0,
        'current_block': 1,
        'x': 4,
        'y': 0,
        'r': 0,
        'board': new Array(18).fill(0),
    };
}

class LocalDB {
    constructor(highScoreKey, savedBoardKey) {
        this.DB_HIGH_SCORE = highScoreKey;
        this.DB_SAVED_BOARD = savedBoardKey;
    }

    getScore() {
        let score = localStorage.getItem(this.DB_HIGH_SCORE);
        return score !== null ? score : 0;
    }

    setScore(score) {
        localStorage.setItem(this.DB_HIGH_SCORE, score);
    }

    setBoard(gameBoard) {
        console.log("Save Game>> ", gameBoard);
        localStorage.setItem(this.DB_SAVED_BOARD, JSON.stringify(gameBoard));
    }

    getBoard() {
        const savedBoardData = localStorage.getItem(this.DB_SAVED_BOARD);
        if (savedBoardData !== null) {
            let savedBoard = JSON.parse(savedBoardData);
            console.log("Load Saved Game>> ", savedBoard);
            if (savedBoard['version'] !== 2) {
                console.log("Load Saved Game>> it is old game!", savedBoard['version']);
                return createEmptyBoard();
            }
            if (!savedBoard.hasOwnProperty('index')) {
                savedBoard['index'] = 0;
            }
            return savedBoard;
        }
        return createEmptyBoard();
    }

    clear() {
        const emptyBoard = createEmptyBoard();
        console.log("Clear Saved Game>> ", emptyBoard);
        localStorage.setItem(this.DB_SAVED_BOARD, JSON.stringify(emptyBoard));
    }
}

class ArcadeDB extends LocalDB {
    constructor() {
        super('HIGH_SCORE', 'SAVED_BOARD');
    }
}

class PuzzleDB extends LocalDB {
    constructor() {
        super('PZ_HIGH_SCORE', 'PZ_SAVED_BOARD');
    }
}

class ItemTetrisDB extends LocalDB {
    constructor() {
        super('ITEM_HIGH_SCORE', 'ITEM_SAVED_BOARD');
    }
}
