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
      const speed = Math.min(this.tetris.getScore()*25/10000, 25);
      if (this._tick > (30-speed)) {
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

  start() {
    if (this.state.state == 4) {
      this.tetris.init();
    } else {
      this.tetris.start();
    }
  }

  resume() {
    if (this.tetris.isPauseState()) {
      this.tetris.start();
    }
  }

  pause() {
    this.tetris.pause();
  }

  newGame() {
    if (this.tetris.isPauseState()) {
      this._scoreDB.clear();
      this.tetris.init();
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
        if (this.tetris.score.needToSave()) {
          console.log("[GameEngine] PauseState> ", "SaveScore");
          this._scoreDB.setScore(this.tetris.score.getHighScore());
        }
        break;
      case 4:
        this.state = this.gameoverState;
        if (this.tetris.score.needToSave()) {
          console.log("[GameEngine] SaveState> ", "SaveScore");
          this._scoreDB.setScore(this.tetris.score.getHighScore());
        }
        this._scoreDB.clear();
        break;
      default:
        console.log("Error: Unknown state ", state);
        break;
    }
  }
}
