class GameEngine extends Observer {
  constructor(tetris) {
    super();
    this.tetris = tetris;
    this.tetris.register(this);

    this.initState = new InitGameState();
    this.idleState = new IdleGameState();
    this.playState = new PlayGameState();
    this.pauseState = new PauseGameState();
    this.gameoverState = new GameoverGameState(); 
    this.state = this.initState;
    this.__tick = 0;
  }

  tick() {
      this.__tick++;
      if (this.__tick > 50) {
        this.moveDown();
        this.__tick = 0;
      }
  }

  moveLeft() {
    this.tetris.moveLeft();
  }

  moveRight() {
    this.tetris.moveRight();
  }

  moveDown() {
    this.__tick = 0;
    this.tetris.moveDown();
  }

  moveBottom() {
    this.__tick = 0;
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

  pause() {
    this.tetris.pause();
  }

  update(state) {
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
        break;
      case 4:
        this.state = this.gameoverState;
        break;
      default:
        console.log("Error: Unknown state ", state);
        break;
    }
  }
}
