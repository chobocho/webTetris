class Observer {
    constructor() {
    }

    /**
     * 0: INIT_STATE
     * 1: IDLE
     * 2: PLAY
     * 3: PAUSE
     * 4: GAME OVER
     */
    update(state) {
        console.log("Observer update: ", state);
    }
}

class Tetris {
    constructor(width, height, scoreDB, boardManager, blockFactory) {
        this.width = width;
        this.height = height;

        this._scoreDB = scoreDB;
        this.board = new TetrisBoard(width, height, boardManager);
        this._boardManager = boardManager;
        this._boardManager.setBoard(this.board);
        this._score = new Score(scoreDB.getScore());

        this.initState = new InitState(this);
        this.idleState = new IdleState(this, this._boardManager);
        this.playState = new PlayState(this, this.board, this._score, this._boardManager, blockFactory);
        this.pauseState = new PauseState(this);
        this.gameoverState = new GameOverState(this);
        this.solveGameState = new SolveState(this);

        this.state = this.initState;
        this.observer = []
    }

    init() {
        this.board.init();
        this._score.init();
        this._boardManager.init();
        this.setState(this.initState);
    }

    idle() {
        this._boardManager.init();
        if (this._boardManager.isPuzzleMode()) {
            this._boardManager.updateBoard();
        } else if (this._boardManager.isItemMode()) {
            this._boardManager.updateBoard();
        } else {
            this.board.init();
        }
        this._score.init();
        this.playState.init();
        this.setState(this.idleState);
    }

    solve() {
        if (this._boardManager.isPuzzleMode()) {
            this._boardManager.updateBoard();
        } else if (this._boardManager.isItemMode()) {
            this._boardManager.updateBoard();
        }
        this.playState.init();
        this.setState(this.idleState);
    }

    resumeGame(gameInfo) {
        this.board.set(gameInfo);
        this._boardManager.setIndex(gameInfo['index']);
        this.playState.set(gameInfo);
        this.score = gameInfo['score'];
        this.setState(this.pauseState);
    }

    register(observer) {
        this.observer.push(observer);
        observer.update(this.state.get());
    }

    addScore(score) {
        if (this.isPlayState()) {
            this._score.add(score);
        }
    }

    notify() {
        this.observer.forEach(e => {
            e.update(this.state.get())
        })
    }

    moveLeft() {
        console.log("Tetris: MoveLeft");
        return this.state.moveLeft();
    }

    moveRight() {
        return this.state.moveRight();
    }

    moveDown() {
        if (this.state.gameOver()) {
            this.board.clearEffect();
            this.setState(this.gameoverState);
            return false;
        }
        let result = this.state.moveDown();
        if (!result && this.state.isClear()) {
            this._score.add(1023);
        }
        if (this.state.isSolve()) {
            console.log("[Tetris] Solved!");
            if (this.isPuzzleMode()) {
                this._score.add(1024);
            } else if (this.isItemMode()) {
                this._score.add(512);
            }
            this._saveHighScore();
            this._boardManager.updateBoard();
            this.saveGame();
            if (this.isItemMode()) {
                let delay = this.board.hasEffect() ? 600 : 0;
                setTimeout(() => {
                        this.board.clearEffect();
                        this.setState(this.idleState);
                    }
                    , delay);
            } else {
                this.setState(this.idleState);
            }
            result = true;
        }
        return result;
    }

    _saveHighScore() {
        if (this._score.needToSave()) {
            console.log("[Tetris] ", "Save High Score");
            this._scoreDB.setScore(this.getHighScore());
        }
    }

    moveBottom() {
        if (this.state.gameOver()) {
            this.setState(this.gameoverState);
            return false;
        } else {
            return this.state.moveBottom();
        }
    }

    moveBottomAndFix() {
        if (this.state.gameOver()) {
            this.setState(this.gameoverState);
            return false;
        } else {
            this.state.moveBottom();
            return this.moveDown();
        }
    }


    rotate() {
        return this.state.rotate();
    }

    left_rotate() {
        return this.state.left_rotate();
    }


    hold() {
        this.state.hold();
    }

    start() {
        console.log("Start");
        this.board.clearEffect();
        this.setState(this.playState);
    }

    pause() {
        console.log("Pause");
        this.setState(this.pauseState);
        this.saveGame();
    }

    setState(newState) {
        this.state = newState;
        this.notify();
    }

    loadBoard(new_board) {
        if (new_board.length === 0) {
            console.log("Empty data!");
            return;
        }

        let data = "";
        try {
            data = JSON.parse(new_board);
        } catch (error) {
            console.error(error);
            console.log("Ignore Data!");
            return;
        }
        console.log(data);
        this.board.setColorBoardWithInt(data);
    }

    isPuzzleMode() {
        return this._boardManager.isPuzzleMode();
    }

    isItemMode() {
        return this._boardManager.isItemMode();
    }

    isArcadeMode() {
        return this._boardManager.isArcadeMode();
    }

    isInitState() {
        return this.state.isInitState();
    }

    isIdleState() {
        return this.state.isIdleState();
    }

    isGameOverState() {
        return this.state.isGameOverState();
    }

    isPlayState() {
        return this.state.isPlayState();
    }

    isPauseState() {
        return this.state.isPauseState();
    }

    isSolveGameState() {
        return this.state.isSolveGameState();
    }

    getCurrentBlock() {
        return this.state.getCurrentBlock();
    }

    getNextNextBlock() {
        return this.state.getNextNextBlock();
    }

    getNextBlock() {
        return this.state.getNextBlock();
    }

    getHoldBlock() {
        return this.state.getHoldBlock();
    }

    getShadowBlock() {
        return this.state.getShadowBlock();
    }

    getBoard() {
        if (this.board.hasEffect()) {
            return this.board.getEffect();
        }
        return this.board.get();
    }

    get score() {
        return this._score.score;
    }

    set score(value) {
        this._score.score = value;
    }

    getHighScore() {
        return this._score.getHighScore();
    }

    getGameInfo() {
        return {
            'version': 5,
            'gameSate': 3,
            'score': this.score,
            'next_next_block': this.playState.nextNextBlock.getType(),
            'nnb_item_index': this.playState.nextNextBlock.getItemIndex(),
            'nnb_item_type': this.playState.nextNextBlock.getItemType(),
            'next_block': this.playState.nextBlock.getType(),
            'nb_item_index': this.playState.nextBlock.getItemIndex(),
            'nb_item_type': this.playState.nextBlock.getItemType(),
            'hold_block': this.playState.holdBlock.getType(),
            'hold_item_index': this.playState.holdBlock.getItemIndex(),
            'hold_item_type': this.playState.holdBlock.getItemType(),
            'current_block': this.playState.currentBlock.getType(),
            'current_item_index': this.playState.currentBlock.getItemIndex(),
            'current_item_type': this.playState.currentBlock.getItemType(),
            'x': this.playState.currentBlock.getX(),
            'y': this.playState.currentBlock.getY(),
            'r': this.playState.currentBlock.getR(),
            'board': this.board.getBoard(),
            'index': this._boardManager.getIndex(),
        };
    }

    saveGame() {
        this._scoreDB.setBoard(this.getGameInfo());
    }
}

