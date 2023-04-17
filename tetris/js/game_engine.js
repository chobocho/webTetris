class GameEngine extends Observer {
  constructor(tetris, scoreDB) {
    super();
    this._scoreDB = scoreDB;
    this.tetris = tetris;
    this.tetris.register(this);

    this.initState = new InitGameState();
    this.idleState = new IdleGameState();
    this.playState = new PlayGameState();
    this.pauseState = new PauseGameState();
    this.gameoverState = new GameoverGameState();
    this.state = this.initState;
    this._tick = 0;
  }

  tick() {
      this._tick++;
      let speed = 0;
      if (this.tetris.isPuzzleMode()) {
        speed = Math.min(this.tetris.score * 25 / 100000, 10);
      } else {
        speed = Math.min(this.tetris.score * 25 / 10000, 25);
      }
      if (this._tick > (50-speed)) {
        this.moveDown();
        this._tick = 0;
      }
  }

  moveLeft() {
    this.tetris.moveLeft();
  }

  moveRight() {
    this.tetris.moveRight();
  }

  moveDown() {
    this._tick = 0;
    this.tetris.moveDown();
  }

  moveBottom() {
    this._tick = 0;
    this.tetris.moveBottom();
  }

  rotate() {
    this.tetris.rotate();
  }

  hold() {
    this.tetris.hold();
  }

  init() {
    if (this.state.state === 0) {
      const savedGame = arcadeModeDB.getBoard();
      if (savedGame['gameSate'] === 3) {
        tetris.resumeGame(savedGame);
      } else {
        tetris.idle();
      }
    }
  }

  start() {
    if (this.tetris.isInitState()) {
      return;
    }
    if (this.tetris.isGameOverState()) {
      this.tetris.init();
    } else if (this.tetris.isIdleState() || this.tetris.isPauseState()) {
      this.tetris.start();
    }
  }

  resume() {
    if (this.tetris.isPauseState()) {
      this.tetris.start();
    }
  }

  load() {
    if (!this.tetris.isPuzzleMode() || !this.tetris.isIdleState()) {
      return;
    }

    let new_board = prompt("Input Custom Board", "");

    if (new_board.length === 0) {
      console.log("Empty data!");
      return;
    }
    this.tetris.loadBoard(new_board);
  }

  pause() {
    if (this.tetris.isPlayState()) {
      this.tetris.pause();
    }
  }

  newGame() {
    if (this.tetris.isPauseState()) {
      let confirmNewGame = confirm("Do you want to start new game?");

      if (confirmNewGame) {
        this._scoreDB.clear();
        this.tetris.init();
      }
    }
  }

  update(state){
    console.log("Observer update: ", state);
    switch(state) {
      case 0:
        this.state = this.initState;
        break;
      case 1:
        this.state = this.idleState;
        break;
      case 2:
        this.state = this.playState;
        break;
      case 3:
        this.state = this.pauseState;
        if (this.tetris._score.needToSave()) {
          console.log("[GameEngine] PauseState> ", "SaveScore");
          this._scoreDB.setScore(this.tetris.getHighScore());
        }
        break;
      case 4:
        this.state = this.gameoverState;
        if (this.tetris._score.needToSave()) {
          console.log("[GameEngine] SaveState> ", "SaveScore");
          this._scoreDB.setScore(this.tetris.getHighScore());
        }
        this._scoreDB.clear();
        break;
      default:
        console.log("Error: Unknown state ", state);
        break;
    }
  }
}
