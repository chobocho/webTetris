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
  constructor(width, height, scoreDB, boardManager) {
    this.width = width;
    this.height = height;

    this._scoreDB = scoreDB;
    this.board = new TetrisBoard(width, height, boardManager);
    this._boardManager = boardManager;
    this._boardManager.setBoard(this.board);
    this._score = new Score(scoreDB.getScore());

    this.initState = new InitState(this);
    this.idleState = new IdleState(this, this._boardManager);
    this.playState = new PlayState(this, this.board, this._score, this._boardManager);
    this.pauseState = new PauseState();
    this.gameoverState = new GameOverState();

    this.state = this.initState;
    this.observer = []
  }

  init() {
    this.board.init();
    this._score.init();
    this.setState(this.initState);
  }

  idle() {
    if (this._boardManager.isPuzzleMode()) {
      this._boardManager.updateBoard();
    } else {
      this.board.init();
    }
    this._score.init();
    this.playState.init();
    this.setState(this.idleState);
  }

  resumeGame(gameInfo) {
    if (this._boardManager.isPuzzleMode()) {
      this.idle();
      return;
    }

    this.board.set(gameInfo);
    this.playState.set(gameInfo);
    this.score = gameInfo['score'];
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
      return;
    }
    this.state.moveDown();
    if (this.state.isSolve()) {
      console.log("[Tetris] Solved!");
      this._boardManager.updateBoard();
      this.setState(this.idleState);
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

  isInitState() { return this.state.isInitState(); }
  isIdleState() { return this.state.isIdleState(); }
  isGameOverState() { return this.state.isGameOverState(); }
  isPlayState() { return this.state.isPlayState(); }
  isPauseState() { return this.state.isPauseState(); }

  getCurrentBlock() { return this.state.getCurrentBlock(); }

  getNextNextBlock() { return this.state.getNextNextBlock(); }

  getNextBlock() { return this.state.getNextBlock(); }

  getHoldBlock() { return this.state.getHoldBlock(); }

  getShadowBlock() { return this.state.getShadowBlock(); }

  getBoard() {
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
      'gameSate': 3,
      'score': this.score,
      'next_next_block': this.playState.nextNextBlock.getType(),
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

