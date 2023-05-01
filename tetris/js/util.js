function printf(tag, log) {
    console.log(tag, log);
}

function createEmptyBoard() {
    return {
        'version': 5,
        'gameState': 0,
        'score': 0,
        'next_next_block': 1,
        'nnb_item_index': 0,
        'nnb_item_type': 0,
        'next_block': 1,
        'nb_item_index': 0,
        'nb_item_type': 0,
        'hold_block': 0,
        'hold_item_index': 0,
        'hold_item_type': 0,
        'current_block': 1,
        'current_item_index': 0,
        'current_item_type': 0,
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
            if (savedBoard['version'] !== 5) {
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
