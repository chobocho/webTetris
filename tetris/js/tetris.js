var block_ = new IBlock(board_width, board_height);
var block_move_count = 0;

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
  constructor(width, height, scoreDB) {
    this.width = width;
    this.height = height;

    this._scoreDB = scoreDB;
    this.board = new TetrisBoard(width, height);
    this.score = new Score(scoreDB.getScore());

    this.initState = new InitState();
    this.idleState = new IdleState();
    this.playState = new PlayState(this, this.board, this.score);
    this.pauseState = new PauseState();
    this.gameoverState = new GameOverState();

    this.state = this.idleState;
    this.observer = [];
  }

  init() {
    this.board.init();
    this.score.init();
    this.setState(this.idleState);
  }

  resumeGame(gameInfo) {
    this.board.set(gameInfo);
    this.playState.set(gameInfo);
    this.score.set(gameInfo['score']);
    this.setState(this.pauseState);
  }

  register(observer) {
    this.observer.push(observer);
    observer.update(this.state.get());
  }

  notify() {
    this.observer.forEach( e => {
      e.update(this.state.get())
    })
  }

  moveLeft() {
    console.log("Tetris: MoveLeft");
    this.state.moveLeft();
  }

  moveRight() {
    this.state.moveRight();
  }

  moveDown() {
    if (this.state.gameOver()) {
      this.setState(this.gameoverState);
    } else {
      this.state.moveDown();
    }
  }

  moveBottom() {
    if (this.state.gameOver()) {
      this.setState(this.gameoverState);
    } else {
       this.state.moveBottom();
       this.moveDown();
    }
  }

  rotate() {
    this.state.rotate();
  }

  hold() {
    this.state.hold();
  }

  start() {
    console.log("Start");
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

  isIdleState() { return this.state.isIdleState(); }
  isGameOverState() { return this.state.isGameOverState(); }
  isPlayState() { return this.state.isPlayState(); }
  isPauseState() { return this.state.isPauseState(); }

  getCurrentBlock() { return this.state.getCurrentBlock(); }
  getNextBlock() { return this.state.getNextBlock(); }
  getHoldBlock() { return this.state.getHoldBlock(); }
  getShadowBlock() { return this.state.getShodowBlock(); }

  getBoard() {
    return this.board.get();
  }

  getScore() {
    return this.score.get();
  }

  getHighScore() {
    return this.score.getHighScore();
  }

  getGameInfo() {
    return {
      'gameSate': 3,
      'score': this.getScore(),
      'next_block': this.playState.nextBlock.getType(),
      'hold_block': this.playState.holdBlock.getType(),
      'current_block': this.playState.currentBlock.getType(),
      'x': this.playState.currentBlock.getX(),
      'y': this.playState.currentBlock.getY(),
      'r': this.playState.currentBlock.getR(),
      'board': this.board.getBoard()
    };
  }

  saveGame() {
    this._scoreDB.setBoard(this.getGameInfo());
  }
}

