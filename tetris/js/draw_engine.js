class Button {
  constructor(name, code, x, y, width, height, alpha) {
    this.name = name;
    this.code = code;
    this.x1 = x;
    this.y1 = y;
    this.x2 = x + width;
    this.y2 = y + height;
    this.alpha = alpha;
  }

  in(tx, ty) {
    let bx1 = gCanvasStartX + this.x1 * gScale;
    let by1 = this.y1 * gScale;
    let bx2 = gCanvasStartX + this.x2 * gScale;
    let by2 = this.y2 * gScale;

    console.log("[Button]" + this.name, tx + ", " + ty);
    console.log("[Button]" + this.name, bx1 + ", " + by1 + ", " + bx2 + ", " + by2);

    if (tx < bx1 || tx > bx2 || ty < by1 || ty > by2) {
      console.log(this.name, "-1");
      return -1;
    }
    console.log(this.name, this.code);
    return this.code;
  }
}

class IdleDrawEngine extends IdleGameState {
  constructor() {
    super();

    let btn_w = blockSize * 3;
    let btn_h = blockSize * 3;
    let image_size = btn_h - 3;

    this.buttons = [];
    this.buttons.push(new Button('play', 83, gStartX + btn_w * 3, gStartY + blockSize * (board_height+1), image_size, image_size, 1.0));
    this.buttons.push(new Button('start', 83, gStartX + blockSize * 2, gStartY + blockSize * 5, blockSize*6, blockSize*2, 1.0));
  }

  OnDraw(canvas, tetris, block_image, button_image) {
    this.__drawKeypad(canvas, button_image);
  }

  __drawKeypad(canvas_, button_image) {
    let _canvas = canvas_;

    _canvas.beginPath();
    this.buttons.forEach(e => {
      _canvas.drawImage(button_image[e.name], e.x1, e.y1, e.x2-e.x1, e.y2-e.y1);
    });
    _canvas.closePath();
  }
} 

class PlayDrawEngine extends PlayGameState {
  constructor() {
    super();

    let btn_w = blockSize * 3; //(board_width + 6) / 4;
    let btn_h = blockSize * 3;
    let image_size = btn_h - 3;

    this.buttons = [];
    this.buttons.push(new Button('left', 37, gStartX, gStartY + blockSize * (board_height + 4), image_size, image_size, 1.0));
    this.buttons.push(new Button('right', 39, gStartX + btn_w * 2, gStartY + blockSize * (board_height + 4), image_size, image_size, 1.0));
    this.buttons.push(new Button('down', 40, gStartX + btn_w, gStartY + blockSize * (board_height + 4), image_size, image_size, 1.0));
    this.buttons.push(new Button('up', 38, gStartX + btn_w * 3, gStartY + blockSize * (board_height + 4), image_size, image_size, 1.0));
    this.buttons.push(new Button('bottom', 32, gStartX + btn_w, gStartY + blockSize * (board_height + 1), image_size, image_size, 1.0));
    this.buttons.push(new Button('hold', 17, gStartX, gStartY + blockSize * (board_height+1), image_size, image_size, 1.0));
    this.buttons.push(new Button('pause', 80, gStartX + btn_w * 3, gStartY + blockSize * (board_height+1), image_size, image_size, 1.0));
  }

  OnDraw(canvas, tetris, block_image, button_image) {
    this.__drawCurrentBlock(canvas, tetris.getCurrentBlock(), block_image);
    this.__drawNextBlock(canvas, tetris.getNextBlock(), block_image);
    this.__drawHoldBlock(canvas, tetris.getHoldBlock(), block_image);
    this.__drawKeypad(canvas, button_image);
  }

  __drawCurrentBlock(canvas_, block, block_image) {
    let _canvas = canvas_;
    let cb_startX = gStartX + block.x * blockSize;
    let cb_startY = gStartY + block.y * blockSize;
    for (let y = 0; y < block.h; ++y) {
      for (let x = 0; x < block.w; ++x) {
        if (block.block[block.r][y][x] !== 0) {
          _canvas.drawImage(block_image[block.type], x * blockSize + cb_startX, y * blockSize + cb_startY, blockSize, blockSize);
        }
      }
    }
  }

  __drawNextBlock(canvas_, block, block_image) {
    let _canvas = canvas_;

    let small_block_size = blockSize * 0.7;
    let nb_startX = gStartX + (board_width + 2) * blockSize;
    let nb_startY = gStartY + blockSize + small_block_size;

    for (let y = 0; y < block.h; ++y) {
      for (let x = 0; x < block.w; ++x) {
        if (block.block[block.r][y][x] !== 0) {
          _canvas.drawImage(block_image[block.type], x * (small_block_size) + nb_startX, y * (small_block_size) + nb_startY, small_block_size, small_block_size);
        }
      }
    }
  }

  __drawHoldBlock(canvas_, block, block_image) {
    let _canvas = canvas_;
    let hb_startX = gStartX + (board_width + 2) * blockSize;
    let hb_startY = gStartY + 7.5 * blockSize;
    for (let y = 0; y < block.h; ++y) {
      for (let x = 0; x < block.w; ++x) {
        if (block.block[block.r][y][x] !== 0) {
          _canvas.drawImage(block_image[block.type], x * (blockSize/2) + hb_startX, y * (blockSize/2) + hb_startY, blockSize/2, blockSize/2);
        }
      }
    }
  }

  __drawKeypad(canvas_, button_image) {
    let _canvas = canvas_;

    _canvas.beginPath();
    this.buttons.forEach(e => {
      _canvas.drawImage(button_image[e.name], e.x1, e.y1, e.x2-e.x1, e.y2-e.y1);
    });
    _canvas.closePath();
  }
}

class PauseDrawEngine extends PauseGameState {
  constructor() {
    super();

    let btn_w = blockSize * 3;
    let btn_h = blockSize * 3;
    let image_size = btn_h - 3;

    this.buttons = [];
    this.buttons.push(new Button('play', 83, gStartX + btn_w * 3, gStartY + blockSize * (board_height+1), image_size, image_size, 1.0));
    this.buttons.push(new Button('resume', 83, gStartX + blockSize * 2, gStartY + blockSize * 5, blockSize*6, blockSize*2, 1.0));
    this.buttons.push(new Button('new_game', 78, gStartX + blockSize * 2, gStartY + blockSize * 9, blockSize*6, blockSize*2, 1.0));
  }

  OnDraw(canvas, tetris, block_image, button_image) {
    this.__drawKeypad(canvas, button_image);
  }

  __drawKeypad(canvas_, button_image) {
    let _canvas = canvas_;

    _canvas.beginPath();
    this.buttons.forEach(e => {
      _canvas.drawImage(button_image[e.name], e.x1, e.y1, e.x2-e.x1, e.y2-e.y1);
    });
    _canvas.closePath();
  }
}

class GameoverDrawEngine extends GameoverGameState {
  constructor() {
    super();

    let btn_w = blockSize * 3;
    let btn_h = blockSize * 3;
    let image_size = btn_h - 3;

    this.buttons = [];
    this.buttons.push(new Button('play', 83, gStartX + btn_w * 3, gStartY + blockSize * (board_height+1), image_size, image_size, 1.0));
    this.buttons.push(new Button('gameover', 83, gStartX + blockSize * 2, gStartY + blockSize * 5, blockSize*6, blockSize*2, 1.0));
  }

  OnDraw(canvas, tetris, block_image, button_image) {
    this.__drawKeypad(canvas, button_image);
  }

  __drawKeypad(canvas_, button_image) {
    let _canvas = canvas_;

    _canvas.beginPath();
    this.buttons.forEach(e => {
      _canvas.drawImage(button_image[e.name], e.x1, e.y1, e.x2-e.x1, e.y2-e.y1);
    });
    _canvas.closePath();
  }
}

class DrawEngine extends Observer {
  constructor(tetris) {
    super();
    this.tetris = tetris;
    this.tetris.register(this);
    this.__LoadImage();
    this.__initValue();
  }

  __LoadImage() {
    this.back_image = LoadImage("img/back.jpg");

    this.left_image = LoadImage("img/left.png");
    this.right_image = LoadImage("img/right.png");
    this.down_image = LoadImage("img/down.png");
    this.bottom_image = LoadImage("img/bottom.png");

    this.rotate_image = LoadImage("img/rotate.png");
    this.play_image = LoadImage("img/play.png");
    this.pause_image = LoadImage("img/pause.png");
    this.hold_image = LoadImage("img/hold.png");

    this.blank_image = LoadImage("img/blank.png");
    this.next_image = LoadImage("img/next.png");
    this.hold_text_image = LoadImage("img/hold_text.png");
    this.score_image = LoadImage("img/score.png");
    this.high_score_image = LoadImage("img/high_score.png");

    this.start_image = LoadImage("img/start.png");
    this.resume_image = LoadImage("img/resume.png");
    this.new_game_image = LoadImage("img/new_game.png");
    this.gameover_image = LoadImage("img/gameover.png");

    this.n0 = LoadImage("img/sn00.png");
    this.n1 = LoadImage("img/sn01.png");
    this.n2 = LoadImage("img/sn02.png");
    this.n3 = LoadImage("img/sn03.png");
    this.n4 = LoadImage("img/sn04.png");
    this.n5 = LoadImage("img/sn05.png");
    this.n6 = LoadImage("img/sn06.png");
    this.n7 = LoadImage("img/sn07.png");
    this.n8 = LoadImage("img/sn08.png");
    this.n9 = LoadImage("img/sn09.png");

    this.buttonImage = {};
    this.buttonImage['left'] = this.left_image;
    this.buttonImage['right'] = this.right_image;
    this.buttonImage['down'] = this.down_image;
    this.buttonImage['bottom'] = this.bottom_image;
    this.buttonImage['up'] = this.rotate_image;

    this.buttonImage['hold'] = this.hold_image;
    this.buttonImage['play'] = this.play_image;
    this.buttonImage['pause'] = this.pause_image;

    this.buttonImage['blank'] = this.blank_image;
    this.buttonImage['next'] = this.next_image;
    this.buttonImage['hold_text'] = this.hold_text_image;
    this.buttonImage['score'] = this.score_image;
    this.buttonImage['high_score'] = this.high_score_image;

    this.buttonImage['start'] = this.start_image;
    this.buttonImage['resume'] = this.resume_image;
    this.buttonImage['new_game'] = this.new_game_image;
    this.buttonImage['gameover'] = this.gameover_image;
    
    this.buttonImage['0'] = this.n0;
    this.buttonImage['1'] = this.n1;
    this.buttonImage['2'] = this.n2;
    this.buttonImage['3'] = this.n3;
    this.buttonImage['4'] = this.n4;
    this.buttonImage['5'] = this.n5;
    this.buttonImage['6'] = this.n6;
    this.buttonImage['7'] = this.n7;
    this.buttonImage['8'] = this.n8;
    this.buttonImage['9'] = this.n9;

    this.back_block = LoadImage("img/black.png");
    this.blue_block = LoadImage("img/blue.png");
    this.cyan_block = LoadImage("img/cyan.png");
    this.gray_block = LoadImage("img/gray.png");
    this.green_block = LoadImage("img/green.png");
    this.magenta_block = LoadImage("img/magenta.png");
    this.orange_block = LoadImage("img/orange.png");
    this.red_block = LoadImage("img/red.png");
    this.yellow_block = LoadImage("img/yellow.png");

    this.block_image = [];
    this.block_image.push(this.gray_block);
    this.block_image.push(this.blue_block);
    this.block_image.push(this.cyan_block);
    this.block_image.push(this.green_block);
    this.block_image.push(this.magenta_block);
    this.block_image.push(this.orange_block);
    this.block_image.push(this.red_block);
    this.block_image.push(this.yellow_block);
  }

  OnDraw() {
    this._drawBoard();
  }

  __initValue() {
    this.initState = new InitGameState();
    this.idleState = new IdleDrawEngine();
    this.playState = new PlayDrawEngine();
    this.pauseState = new PauseDrawEngine();
    this.gameoverState = new GameoverDrawEngine(); 
    this.state = this.initState;

    let btn_w = blockSize * 3;
    let btn_h = blockSize * 3;
    let image_size = btn_h - 3;

    this.startX = gStartX;
    this.startY = gStartY;

    this.buttons = [];
    this.buttons.push(new Button('left', 0, this.startX, this.startY + blockSize * (board_height + 4), image_size, image_size, 0.3));
    this.buttons.push(new Button('right', 0, this.startX + btn_w * 2, this.startY + blockSize * (board_height + 4), image_size, image_size, 0.3));
    this.buttons.push(new Button('down', 0, this.startX + btn_w, this.startY + blockSize * (board_height + 4), image_size, image_size, 0.3));
    this.buttons.push(new Button('up', 0, this.startX + btn_w * 3, this.startY + blockSize * (board_height + 4), image_size, image_size, 0.3));
    this.buttons.push(new Button('bottom', 0, this.startX + btn_w, this.startY + blockSize * (board_height + 1), image_size, image_size, 0.3));

    this.buttons.push(new Button('next',  0, this.startX + blockSize * 11, this.startY, blockSize*4, blockSize, 1.0));
    this.buttons.push(new Button('blank', 0, this.startX + blockSize * 11, this.startY+blockSize * 1, blockSize*4, blockSize*4, 0.5));
    this.buttons.push(new Button('hold_text', 0, this.startX + blockSize * 11, this.startY+blockSize * 6, blockSize*4, blockSize, 1.0));
    this.buttons.push(new Button('blank', 0, this.startX + blockSize * 11, this.startY+blockSize * 7, blockSize*4, blockSize*3, 0.5));

    this.buttons.push(new Button('score', 0, this.startX + blockSize * 11, this.startY+blockSize * 11, blockSize*4, blockSize, 1.0));
    this.buttons.push(new Button('blank', 0, this.startX + blockSize * 11, this.startY+blockSize * 12, blockSize*4, blockSize, 0.5));
    this.buttons.push(new Button('high_score', 0, this.startX + blockSize * 11, this.startY+blockSize * 14, blockSize*4, blockSize, 1.0));
    this.buttons.push(new Button('blank', 0, this.startX + blockSize * 11, this.startY+blockSize * 15, blockSize*4, blockSize, 0.5));
  }

  __drawBackGround() {
    bufCtx.beginPath();
    bufCtx.drawImage(this.back_image, 0, 0, gScreenX, gScreenY);

    let startY = this.startY;
    let blockSize = 40;

    let board = this.tetris.getBoard();

    bufCtx.globalAlpha = 0.3;
    for (let y = 0; y < board_height; y++) {
      for (let x = 0; x < board_width; x++) {
        bufCtx.drawImage(this.back_block, this.startX + x * blockSize, y * blockSize + startY, blockSize, blockSize);
      }
    }
    bufCtx.globalAlpha = 1.0;

    for (let y = 0; y < board_height; y++) {
      for (let x = 0; x < board_width; x++) {
        if (board[y][x] === 0) {
          continue;
        }
        bufCtx.drawImage(this.block_image[0], this.startX + x * blockSize , y * blockSize + startY, blockSize, blockSize);
      }
    }

    bufCtx.closePath();
    bufCtx.stroke();
  }

  __drawKeypad() {
    bufCtx.beginPath();
    this.buttons.forEach(e => {
      bufCtx.globalAlpha = e.alpha;
      bufCtx.drawImage(this.buttonImage[e.name], e.x1, e.y1, e.x2-e.x1, e.y2-e.y1);
      bufCtx.globalAlpha = 1.0;
    });
    bufCtx.closePath();
    bufCtx.stroke();
  }

  __drawScore(canvas_, button_image, score, high_score) {
    let code = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let _canvas = canvas_;
    _canvas.beginPath();

    let pos = 0;
    let imageSize = blockSize * 0.7;
    const drawX = this.startX + blockSize * 14;
    let drawY = this.startY + blockSize * 12;

    while (score > 0) {
      _canvas.drawImage(button_image[code[score%10]], drawX - pos * imageSize, drawY, imageSize, imageSize);
      score = Math.floor(score / 10);
      pos++;
    }

    pos = 0;
    drawY = this.startY + blockSize * 15;

    while (high_score > 0) {
      _canvas.drawImage(button_image[code[high_score%10]], drawX - pos * imageSize, drawY, imageSize, imageSize);
      high_score = Math.floor(high_score / 10);
      pos++;
    }
    _canvas.closePath();
  }

  _drawBoard() {
    this.__drawBackGround();
    this.__drawKeypad();
    this.state.OnDraw(bufCtx, this.tetris, this.block_image, this.buttonImage, this.startX);
    this.__drawScore(bufCtx, this.buttonImage, tetris.getScore(), tetris.getHighScore());
    cvs.clearRect(0, 0, canvas.width, canvas.height);
    cvs.drawImage(bufCanvas, gCanvasStartX, 0, gScreenX*gScale, gScreenY*gScale);
  }

  getEventCode(x, y) {
    console.log("GetEventCode:", x, y);

    let result = -1;

    this.state.buttons.forEach(e => {
      let code = e.in(x, y);
      if (code !== -1) {
        result = code;
      }
    });

    return result;
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
