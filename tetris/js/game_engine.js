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
    this._max_move = 16;
  }

  tick() {
      this._tick++;
      let speed = 0;
      if (this.tetris.isPuzzleMode()) {
        speed = Math.min(this.tetris.score * 25 / 100000, 10);
      } else if (this.tetris.isItemMode()) {
        speed = Math.min(this.tetris.score * 25 / 100000, 25);
      } else {
        speed = Math.min(this.tetris.score * 25 / 10000, 25);
      }
      if (this._tick > (50-speed)) {
        this.tetris.addScore(1);
        this.moveDown();
        this._tick = 0;
        this._max_move = 12;
      }
  }

  moveLeft() {
    if (this.tetris.moveLeft()) {
      if (this._max_move > 0) {
        this._tick = 10;
      }
      this._max_move--;
    }
  }

  moveRight() {
    if (this.tetris.moveRight()) {
      if (this._max_move > 0) {
        this._tick = 10;
      }
      this._max_move--;
    }
  }

  moveDown() {
    this._tick = 0;
    this.tetris.moveDown();
  }

  moveBottom() {
    if (this.tetris.moveBottom()) {
      this._tick = 0;
    }
  }

  moveBottomAndFix() {
    this.tetris.moveBottomAndFix();
  }

  rotate() {
    if (this.tetris.rotate()) {
      if (this._max_move > 0) {
        this._tick = 0;
      }
      this._max_move--;
    }
  }

  left_rotate() {
    if (this.tetris.left_rotate()) {
      if (this._max_move > 0) {
        this._tick = 0;
      }
      this._max_move--;
    }
  }

  hold() {
    this.tetris.hold();
  }

  init() {
    if (this.tetris.isInitState()) {
      const savedGame = this._scoreDB.getBoard();
      if (savedGame['gameSate'] === 3) {
        tetris.resumeGame(savedGame);
      } else {
        tetris.idle();
      }
    }
  }

  main_menu() {
    if (this.tetris.isPauseState()) {
      let confirmNewGame = confirm("Do you want to quit game?");

      if (confirmNewGame) {
        this.tetris.init();
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
    if (this.tetris.isArcadeMode() || !this.tetris.isIdleState()) {
      return;
    }

    let new_board = prompt("Input Custom Board", "");

    if (new_board == null || new_board.length === 0) {
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
