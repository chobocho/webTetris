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
    } else if (this._boardManager.isItemMode()) {
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
    if (this._boardManager.isItemMode()) {
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
    return this.state.moveLeft();
  }

  moveRight() {
    return this.state.moveRight();
  }

  moveDown() {
    if (this.state.gameOver()) {
      this.setState(this.gameoverState);
      return false;
    }
    let result = this.state.moveDown();
    if (this.state.isSolve()) {
      console.log("[Tetris] Solved!");
      this._score.add(1004);
      this._saveHighScore();
      this._boardManager.updateBoard();
      this.setState(this.idleState);
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

  isPuzzleMode() { return this._boardManager.isPuzzleMode(); }
  isItemMode() { return this._boardManager.isItemMode(); }
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

