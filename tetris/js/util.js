function printf(tag, log) {
    console.log(tag, log);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Guard against "instant death" in puzzle/item mode: a map whose obstacle
// stack is taller than MAX_MAP_HEIGHT leaves the freshly spawned block no room
// and the game ends the moment the level loads. Maps are bottom-aligned, so we
// trim the overflow rows off the TOP, keeping the base of the picture intact
// and guaranteeing (board_height - MAX_MAP_HEIGHT) empty rows above every map.
// Returns the same object when already within the limit, else a trimmed copy.
function capMapHeight(map) {
    let top = board_height;
    for (let i = 0; i < board_height; i++) {
        if (map[i] && map[i] !== 0) {
            top = i;
            break;
        }
    }
    if (board_height - top <= MAX_MAP_HEIGHT) {
        return map;
    }
    let cut = board_height - MAX_MAP_HEIGHT; // rows [0, cut) forced empty
    let result = {};
    for (let i = 0; i < board_height; i++) {
        result[i] = (i < cut) ? 0 : (map[i] || 0);
    }
    return result;
}

function createEmptyBoard() {
    return {
        'version': SAVED_BOARD_VERSION,
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
        'board': Array.from({length: board_height}, () => new Array(board_width).fill(0)),
    };
}

class LocalDB {
    constructor(highScoreKey, savedBoardKey, levelStarsKey) {
        this.DB_HIGH_SCORE = highScoreKey;
        this.DB_SAVED_BOARD = savedBoardKey;
        this.DB_LEVEL_STARS = levelStarsKey; // may be undefined (arcade: no levels)
    }

    // --- per-level 3-star progress -----------------------------------------
    // Stored as a JSON object { levelIndex: bestStars(1..3) }. A level is
    // "unlocked" once the previous level has at least 1 star (level 0 always).
    getLevelStars() {
        if (!this.DB_LEVEL_STARS) return {};
        try {
            const raw = localStorage.getItem(this.DB_LEVEL_STARS);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            return {};
        }
    }

    getStar(index) {
        const stars = this.getLevelStars();
        return stars[index] || 0;
    }

    setLevelStar(index, stars) {
        if (!this.DB_LEVEL_STARS) return;
        const all = this.getLevelStars();
        if ((all[index] || 0) < stars) {
            all[index] = stars;
            localStorage.setItem(this.DB_LEVEL_STARS, JSON.stringify(all));
        }
    }

    isUnlocked(index) {
        return index <= 0 || this.getStar(index - 1) >= 1;
    }

    getScore() {
        let score = localStorage.getItem(this.DB_HIGH_SCORE);
        return score !== null ? (parseInt(score, 10) || 0) : 0;
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
            let savedBoard;
            try {
                savedBoard = JSON.parse(savedBoardData);
            } catch (e) {
                console.log("Load Saved Game>> broken data!", e);
                return createEmptyBoard();
            }
            console.log("Load Saved Game>> ", savedBoard);
            if (savedBoard['version'] !== SAVED_BOARD_VERSION) {
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
        super('PZ_HIGH_SCORE', 'PZ_SAVED_BOARD', 'PZ_LEVEL_STARS');
    }
}

class ItemTetrisDB extends LocalDB {
    constructor() {
        super('ITEM_HIGH_SCORE', 'ITEM_SAVED_BOARD', 'ITEM_LEVEL_STARS');
    }
}
