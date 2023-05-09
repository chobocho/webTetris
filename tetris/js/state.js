class State {
    constructor(tetris) {
        this.Tetris = tetris;
        this.state = 0;
    }

    init() {
    }

    get() {
        return this.state;
    }

    hold() {
        return false;
    }

    rotate() {
        // TODO implement here
        return false;
    }

    left_rotate() {
        // TODO implement here
        return false;
    }

    moveLeft() {
        // TODO implement here
        return false;
    }

    moveRight() {
        // TODO implement here
        return false;
    }

    moveDown() {
        // TODO implement here
        return false;
    }

    fixCurrentBlock() {
    }

    moveBottom() {
        // TODO implement here
        return false;
    }

    updateBlock() {
    }

    gameOver() {
        return false;
    }

    isClear() {
        return false;
    }

    isSolve() {
        return false;
    }

    updateBoard() {

    }

    getCurrentBlock() {
        return new EmptyBlock(0, 0);
    }

    getNextBlock() {
        return new EmptyBlock(0, 0);
    }

    getNextNextBlock() {
        return new EmptyBlock(0, 0);
    }

    getHoldBlock() {
        return new EmptyBlock(0, 0);
    }

    getShadowBlock() {
        return new EmptyBlock(0, 0);
    }

    isInitState() { return false; }
    isIdleState() { return false; }
    isGameOverState() { return false; }
    isPlayState() { return false; }
    isPauseState() { return false; }

    isSolveGameState() { return false; }
}

class InitState extends State {
    constructor(tetris) {
        super(tetris);
        this.state = 0;
    }

    isInitState() {
        return true;
    }
}

class IdleState extends State {
    constructor(tetris, boardManager) {
        super(tetris);
        this.state = 1;
        this._boardManager = boardManager;
    }

    isIdleState() {
        return true;
    }
}

class PlayState extends State {
    constructor(tetris, board, score, boardManager, blockFactory) {
        super(tetris);
        this.state = 2;
        this.blockFactory = blockFactory;
        this.currentBlock = this.blockFactory.create();
        this.nextNextBlock = this.blockFactory.create();
        this.nextBlock = this.blockFactory.create();
        this.holdBlock = this.blockFactory.getEmptyBlock();
        this.shadowBlock = this.blockFactory.getBlock(this.currentBlock.getType());
        this.tetrisBoard = board;
        this.score = score;
        this._boardManager = boardManager;
    }

    init() {
        this.currentBlock = this.blockFactory.create();
        this.nextNextBlock = this.blockFactory.create();
        this.nextBlock = this.blockFactory.create();
        this.holdBlock = this.blockFactory.getEmptyBlock();
        this.resetShadowBlock();
    }

    set(gameInfo) {
        this.nextNextBlock = this.blockFactory.getBlock(gameInfo['next_next_block']);
        let item = gameInfo['nnb_item_index'];
        let item_type = gameInfo['nnb_item_type'];
        this.nextNextBlock.setItem(item, item_type);

        this.nextBlock = this.blockFactory.getBlock(gameInfo['next_block']);
        item = gameInfo['nb_item_index'];
        item_type = gameInfo['nb_item_type'];
        this.nextBlock.setItem(item, item_type);

        this.holdBlock = this.blockFactory.getBlock(gameInfo['hold_block']);
        item = gameInfo['hold_item_index'];
        item_type = gameInfo['hold_item_type'];
        this.holdBlock.setItem(item, item_type);

        this.currentBlock = this.blockFactory.getBlock(gameInfo['current_block']);
        item = gameInfo['current_item_index'];
        item_type = gameInfo['current_item_type'];
        this.currentBlock.setItem(item, item_type);
        this.currentBlock.set(gameInfo['x'], gameInfo['y'], gameInfo['r']);

        this.resetShadowBlock();
    }

    resetShadowBlock() {
        this.shadowBlock = this.blockFactory.getBlock(this.currentBlock.getType());
        this.updateShadowBlock();
    }

    updateShadowBlock() {
        this.shadowBlock.x = this.currentBlock.x;
        this.shadowBlock.y = this.currentBlock.y;
        this.shadowBlock.r = this.currentBlock.r;
        while (this.tetrisBoard.isAcceptable(this.shadowBlock)) {
            this.shadowBlock.moveDown();
        }
        if (!this.tetrisBoard.isAcceptable(this.shadowBlock)) {
            this.shadowBlock.moveUp();
        }
        console.log(">>shadow ", this.shadowBlock.x, this.shadowBlock.y);
    }

    isPlayState() {
        return true;
    }

    gameOver() {
        return !this.tetrisBoard.isAcceptable(this.currentBlock);
    }

    isClear() {
        return this.tetrisBoard.isClear();
    }

    isSolve() {
        return this.tetrisBoard.isSolve();
    }

    hold() {
        if (this.holdBlock.type === 0) {
            this.holdBlock = this.currentBlock;
            this.updateBlock();
            return true;
        }

        let tmpBlock = this.currentBlock;
        this.currentBlock = this.holdBlock;
        this.currentBlock.x = tmpBlock.x;
        this.currentBlock.y = tmpBlock.y;
        if (this.tetrisBoard.isAcceptable(this.currentBlock)) {
            this.holdBlock = tmpBlock;
            console.log("Hold");
            this.resetShadowBlock();
        } else {
            this.currentBlock = tmpBlock;
            console.log("UnHold");
        }

        return true;
    }

    rotate() {
        if (this.tetrisBoard.hasEffect()) {
            return;
        }

        let x = this.currentBlock.x;
        let y = this.currentBlock.y;
        this.currentBlock.rotate();
        for (let i = 0; i < this.currentBlock.wallKick.length; i++) {
            this.currentBlock.applyWallKick(x, y, i);
            if (this.tetrisBoard.isAcceptable(this.currentBlock)) {
                this.updateShadowBlock();
                return true;
            }
        }
        this.currentBlock.x = x;
        this.currentBlock.y = y;
        this.currentBlock.preRotate();
        return false;
    }

    left_rotate() {
        if (this.tetrisBoard.hasEffect()) {
            return;
        }

        let x = this.currentBlock.x;
        let y = this.currentBlock.y;
        this.currentBlock.preRotate();
        for (let i = 0; i < this.currentBlock.leftWallKick.length; i++) {
            this.currentBlock.applyLeftWallKick(x, y, i);
            if (this.tetrisBoard.isAcceptable(this.currentBlock)) {
                this.updateShadowBlock();
                return true;
            }
        }
        this.currentBlock.x = x;
        this.currentBlock.y = y;
        this.currentBlock.rotate();
        return false;
    }


    moveLeft() {
        if (this.tetrisBoard.hasEffect()) {
            return;
        }

        this.currentBlock.moveLeft();
        if (!this.tetrisBoard.isAcceptable(this.currentBlock)) {
            this.currentBlock.moveRight();
            return false;
        }
        this.updateShadowBlock();
        return true;
    }

    moveRight() {
        if (this.tetrisBoard.hasEffect()) {
            return;
        }

        this.currentBlock.moveRight();
        if (!this.tetrisBoard.isAcceptable(this.currentBlock)) {
            this.currentBlock.moveLeft();
            return false;
        }
        this.updateShadowBlock();
        return true;
    }

    moveDown() {
        if (this.tetrisBoard.hasEffect()) {
            return;
        }

        this.currentBlock.moveDown();
        if (this.tetrisBoard.isAcceptable(this.currentBlock)) {
            console.log("Accept");
            return true;
        }

        this.currentBlock.moveUp();
        console.log("Can not move down");
        this.fixCurrentBlock();
        this.updateBoard();
        this.updateBlock();
        this.Tetris.saveGame();

        return false;
    }

    moveBottom() {
        if (this.tetrisBoard.hasEffect()) {
            return;
        }

        if (!this.moveDown()) {
            return false;
        }
        while(this.tetrisBoard.isAcceptable(this.currentBlock)) {
            this.currentBlock.moveDown();
        }
        if (this.tetrisBoard.isAcceptable(this.currentBlock)) {
            return true;
        }
        this.currentBlock.moveUp();
        return true;
    }

    updateBoard() {
        let removedLine = this.tetrisBoard.arrange();
        if (removedLine === 0) {
            return;
        }
        if (this._boardManager.isArcadeMode()) {
            if (removedLine > 1) {
                removedLine *= 3;
            }
        }
        this.score.increase(removedLine);
    }

    updateBlock() {
        this.currentBlock = this.nextBlock;
        this.nextBlock = this.nextNextBlock;
        this.nextNextBlock = this.blockFactory.create();
        this.resetShadowBlock();
    }

    fixCurrentBlock() {
        this.tetrisBoard.addBlock(this.currentBlock);
    }

    getCurrentBlock() {
        return this.currentBlock;
    }

    getNextBlock() {
        return this.nextBlock;
    }

    getNextNextBlock() {
        return this.nextNextBlock;
    }

    getHoldBlock() {
        return this.holdBlock;
    }

    getShadowBlock() {
        if ((this.shadowBlock.y - this.currentBlock.y) >= this.currentBlock.h) {
            return this.shadowBlock;
        } else {
            return new EmptyBlock(0, 0);
        }
    }
}

class PauseState extends State {
    constructor(tetris) {
        super(tetris);
        this.state = 3;
    }

    isPauseState() { return true; }
}

class GameOverState extends State {
    constructor(tetris) {
        super(tetris);
        this.state = 4;
    }

    isGameOverState() { return true; }
}

class SolveState extends State {
    constructor(tetris) {
        super(tetris);
        this.state = 5;
    }

    isSolveGameState() { return true; }
}


class GameState {
    constructor() {
    }

    OnDraw(canvas, tetris, block_image, button_image) {

    }
}
  
  class InitGameState extends GameState {
    constructor() {
      super();
      this.state = 0;
    }
  }
  
  class IdleGameState extends GameState {
    constructor() {
      super();
      this.state = 1;
    }
  } 
  
  class PlayGameState extends GameState {
    constructor() {
      super();
      this.state = 2;
    }
  }
  
  class PauseGameState extends GameState {
    constructor() {
      super();
      this.state = 3;
    }
  }
  
  class GameoverGameState extends GameState {
    constructor() {
      super();
      this.state = 4;
    }
  }

class SolveGameState extends GameState {
    constructor() {
        super();
        this.state = 5;
    }
}