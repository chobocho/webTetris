function printf(tag, log) {
    console.log(tag, log);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

class LocalDB {
    constructor() {
        this.DB_HIGH_SCORE = 'HIGH_SCORE';
        this.DB_SAVED_BOARD = 'SAVED_BOARD';
        // localStorage.clear();
    }

    getScore() {
        let score = localStorage.getItem(this.DB_HIGH_SCORE);
        if (score !== null) {
            return score;
        }
        return 0;
    }

    setScore(score) {
        localStorage.setItem(this.DB_HIGH_SCORE, score);
    }

    setBoard(gameBoard) {
        console.log("Save Game>> ",  gameBoard);
        localStorage.setItem(this.DB_SAVED_BOARD, JSON.stringify(gameBoard))
    }

    getBoard() {
        const savedBoardData = localStorage.getItem(this.DB_SAVED_BOARD);
        if (savedBoardData !== null) {
            let savedBoard = JSON.parse(localStorage.getItem(this.DB_SAVED_BOARD));
            console.log("Load Saved Game>> ",  savedBoard);
            return savedBoard;
        }
        // GameState 1: IdleState
        // Block 0: Nothing
        return {
            'gameSate': 0,
            'score': 0,
            'next_next_block': 1,
            'next_block': 1,
            'hold_block': 0,
            'current_block': 1,
            'x': 4,
            'y': 0,
            'r': 0,
            'board': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        };
    }

    clear() {
        const emptyBoard = {
            'gameSate': 0,
            'score': 0,
            'next_next_block': 1,
            'next_block': 1,
            'hold_block': 0,
            'current_block': 1,
            'x': 4,
            'y': 0,
            'r': 0,
            'board': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        };
        console.log("Clear Saved Game>> ",  emptyBoard);
        localStorage.setItem(this.DB_SAVED_BOARD, JSON.stringify(emptyBoard))
    }
}
