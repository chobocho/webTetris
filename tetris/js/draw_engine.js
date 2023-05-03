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

class InitDrawEngine extends InitGameState {
  constructor() {``
    super();

    this.buttons = [];
    this.buttons.push(new Button('arcade', 65, gStartX + blockSize * 2, gStartY + blockSize * 5, blockSize*6, blockSize*2, 1.0));
    this.buttons.push(new Button('puzzle', 85, gStartX + blockSize * 2, gStartY + blockSize * 9, blockSize*6, blockSize*2, 1.0));
    this.buttons.push(new Button('item_mode', 73, gStartX + blockSize * 2, gStartY + blockSize * 13, blockSize*6, blockSize*2, 1.0));
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

class IdleDrawEngine extends IdleGameState {
  constructor() {
    super();

    let btn_w = blockSize * 2.5;
    let btn_h = blockSize * 2.5;
    let image_size = btn_h - 3;

    this.buttons = [];
    this.buttons.push(new Button('start', 83, gStartX + blockSize * 2, gStartY + blockSize * 5, blockSize*6, blockSize*2, 1.0));
    this.buttons.push(new Button('play', 83, gStartX + btn_w * 4 + blockSize * 3, gStartY + blockSize * (board_height+1), image_size, image_size, 1.0));
    this.buttons.push(new Button('up', 76, gStartX + btn_w * 4 + blockSize * 3, gStartY + blockSize * (board_height+4), image_size, image_size, 0.3));
  }

  OnDraw(canvas, tetris, block_image, button_image) {
    this.#drawBoard(canvas, tetris.getBoard(), block_image);
    this.__drawKeypad(canvas, button_image);
  }

  #drawBoard(canvas, board, block_image){
    canvas.beginPath();
    let startY = gStartY;

    canvas.globalAlpha = 1.0;

    for (let y = 0; y < board_height; y++) {
      for (let x = 0; x < board_width; x++) {
        if (board[y][x] === 0) {
          continue;
        }
        const color = board[y][x];
        canvas.drawImage(block_image[color], gStartX + x * blockSize , y * blockSize + startY, blockSize, blockSize);
      }
    }

    canvas.closePath();
    canvas.stroke();
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

    let btn_w = blockSize * 2.5;
    let btn_h = blockSize * 2.5;
    let image_size = btn_h - 3;
    let half_bls = blockSize * 0.5;

    this.buttons = [];
    this.buttons.push(new Button('rotate', 90, gStartX-half_bls, gStartY + blockSize * (board_height + 4), image_size, image_size, 1.0));
    this.buttons.push(new Button('left', 37, gStartX-half_bls + btn_w + blockSize * 0.5, gStartY+ blockSize * (board_height + 4), image_size, image_size, 1.0));
    this.buttons.push(new Button('down', 40, gStartX-half_bls + btn_w * 2 + blockSize, gStartY + blockSize * (board_height + 4), image_size, image_size, 1.0));
    this.buttons.push(new Button('right', 39, gStartX + btn_w * 3 + blockSize * 2.5, gStartY + blockSize * (board_height + 4), image_size, image_size, 1.0));
    this.buttons.push(new Button('up', 38, gStartX + btn_w * 4 + blockSize * 3, gStartY + blockSize * (board_height + 4), image_size, image_size, 1.0));
    this.buttons.push(new Button('bottom', 32, gStartX-half_bls + btn_w * 2 + blockSize, gStartY + blockSize * (board_height + 1), image_size, image_size, 1.0));
    this.buttons.push(new Button('hold', 17, gStartX-half_bls, gStartY + blockSize * (board_height + 1), image_size, image_size, 1.0));
    this.buttons.push(new Button('pause', 80, gStartX + btn_w * 4 + blockSize * 3, gStartY + blockSize * (board_height+1), image_size, image_size, 1.0));
  }

  OnDraw(canvas, tetris, block_image, button_image) {
    this.#drawBoard(canvas, tetris.getBoard(), block_image);
    this.__drawCurrentBlock(canvas, tetris.getCurrentBlock(), block_image);
    this.__drawNextBlock(canvas, tetris.getNextNextBlock(), tetris.getNextBlock(), block_image);
    this.__drawHoldBlock(canvas, tetris.getHoldBlock(), block_image);
    this.__drawKeypad(canvas, button_image);
  }

  #drawBoard(canvas, board, block_image){
    canvas.beginPath();
    let startY = gStartY;

    canvas.globalAlpha = 1.0;

    for (let y = 0; y < board_height; y++) {
      for (let x = 0; x < board_width; x++) {
        if (board[y][x] === 0) {
          continue;
        }
        const color = board[y][x];
        canvas.drawImage(block_image[color], gStartX + x * blockSize , y * blockSize + startY, blockSize, blockSize);
      }
    }

    canvas.closePath();
    canvas.stroke();
  }

  __drawCurrentBlock(canvas_, block, block_image) {
    let _canvas = canvas_;
    let cb_startX = gStartX + block.x * blockSize;
    let cb_startY = gStartY + block.y * blockSize;
    for (let y = 0; y < block.h; ++y) {
      for (let x = 0; x < block.w; ++x) {
        if (block.block[block.r][y][x] !== 0) {
          let bImg = block.type;
          if(tetris.isItemMode()) {
             if (block.block[block.r][y][x] >= 8) {
               bImg = block.block[block.r][y][x];
             }
          }
          _canvas.drawImage(block_image[bImg], x * blockSize + cb_startX, y * blockSize + cb_startY, blockSize, blockSize);
        }
      }
    }
  }

  __drawNextBlock(canvas_, block1, block2, block_image) {
    let _canvas = canvas_;

    let small_block_size = blockSize * 0.6;
    let nb_startX = gStartX + (board_width + 2) * blockSize;
    let nb_startY = gStartY + blockSize + small_block_size * 0.5;

    for (let y = 0; y < block2.h; ++y) {
      for (let x = 0; x < block2.w; ++x) {
        if (block2.block[block2.r][y][x] !== 0) {
          let bImg = block2.type;
          if(tetris.isItemMode()) {
            if (block2.block[block2.r][y][x] >= 8) {
              bImg = block2.block[block2.r][y][x];
            }
          }
          _canvas.drawImage(block_image[bImg], x * (small_block_size) + nb_startX, y * (small_block_size) + nb_startY, small_block_size, small_block_size);
        }
      }
    }

    nb_startY = gStartY + blockSize + small_block_size * 5.5;
    for (let y = 0; y < block1.h; ++y) {
      for (let x = 0; x < block1.w; ++x) {
        if (block1.block[block1.r][y][x] !== 0) {
          let bImg = block1.type;
          if(tetris.isItemMode()) {
            if (block1.block[block1.r][y][x] >= 8) {
              bImg = block1.block[block1.r][y][x];
            }
          }
          _canvas.drawImage(block_image[bImg], x * (small_block_size) + nb_startX, y * (small_block_size) + nb_startY, small_block_size, small_block_size);
        }
      }
    }
  }

  __drawHoldBlock(canvas_, block, block_image) {
    let _canvas = canvas_;
    let hb_startX = gStartX + (board_width + 2) * blockSize;
    let hb_startY = gStartY + 9.5 * blockSize;
    for (let y = 0; y < block.h; ++y) {
      for (let x = 0; x < block.w; ++x) {
        if (block.block[block.r][y][x] !== 0) {
          let bImg = block.type;
          if(tetris.isItemMode()) {
            if (block.block[block.r][y][x] >= 8) {
              bImg = block.block[block.r][y][x];
            }
          }
          _canvas.drawImage(block_image[bImg], x * (blockSize/2) + hb_startX, y * (blockSize/2) + hb_startY, blockSize/2, blockSize/2);
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
  constructor() {``
    super();

    let btn_w = blockSize * 2.5;
    let btn_h = blockSize * 2.5;
    let image_size = btn_h - 3;

    this.buttons = [];
    this.buttons.push(new Button('play', 83, gStartX + btn_w * 4 + blockSize * 3, gStartY + blockSize * (board_height+1), image_size, image_size, 1.0));
    this.buttons.push(new Button('resume', 83, gStartX + blockSize * 2, gStartY + blockSize * 5, blockSize*6, blockSize*2, 1.0));
    this.buttons.push(new Button('new_game', 78, gStartX + blockSize * 2, gStartY + blockSize * 9, blockSize*6, blockSize*2, 1.0));
    this.buttons.push(new Button('main_menu', 77, gStartX + blockSize * 2, gStartY + blockSize * 13, blockSize*6, blockSize*2, 1.0));
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

    let btn_w = blockSize * 2.5;
    let btn_h = blockSize * 2.5;
    let image_size = btn_h - 3;

    this.buttons = [];
    this.buttons.push(new Button('play', 83, gStartX + btn_w * 4 + blockSize * 3, gStartY + blockSize * (board_height+1), image_size, image_size, 1.0));
    this.buttons.push(new Button('gameover', 83, gStartX + blockSize * 2, gStartY + blockSize * 5, blockSize*6, blockSize*2, 1.0));
  }

  OnDraw(canvas, tetris, block_image, button_image) {
    this.#drawBoard(canvas, tetris.getBoard(), block_image);
    this.__drawKeypad(canvas, button_image);
  }

  #drawBoard(canvas, board, block_image){
    canvas.beginPath();
    let startY = gStartY;

    canvas.globalAlpha = 1.0;

    for (let y = 0; y < board_height; y++) {
      for (let x = 0; x < board_width; x++) {
        if (board[y][x] === 0) {
          continue;
        }
        const color = board[y][x];
        canvas.drawImage(block_image[color], gStartX + x * blockSize , y * blockSize + startY, blockSize, blockSize);
      }
    }

    canvas.closePath();
    canvas.stroke();
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
  constructor(tetris, images) {
    super();
    this.tetris = tetris;
    this.tetris.register(this);
    this._image_res = images._images;
    this.__LoadImage();
    this.__initValue();
  }

  __LoadImage() {
    this.back_image = this._image_res.back;
    this.back2_image = this._image_res.back2;
    this.back3_image = this._image_res.back3;


    this.left_image = this._image_res.left;
    this.right_image = this._image_res.right;
    this.down_image = this._image_res.down;
    this.bottom_image = this._image_res.bottom;

    this.rotate_image = this._image_res.rotate;
    this.left_rotate_image = this._image_res.left_rotate;
    this.play_image = this._image_res.play;
    this.pause_image = this._image_res.pause;
    this.hold_image = this._image_res.hold;

    this.blank_image = this._image_res.blank;
    this.next_image = this._image_res.next;
    this.hold_text_image = this._image_res.hold_text;
    this.score_image = this._image_res.score;
    this.high_score_image = this._image_res.high_score;

    this.main_menu_image = this._image_res.main_menu;
    this.start_image = this._image_res.start;
    this.arcade_image = this._image_res.arcade;
    this.item_mode_image = this._image_res.item_mode;
    this.puzzle_image = this._image_res.puzzle;
    this.resume_image = this._image_res.resume;
    this.new_game_image = this._image_res.new_game;
    this.gameover_image = this._image_res.gameover;

    this.n0 = this._image_res.n0;
    this.n1 = this._image_res.n1;
    this.n2 = this._image_res.n2;
    this.n3 = this._image_res.n3;
    this.n4 = this._image_res.n4;
    this.n5 = this._image_res.n5;
    this.n6 = this._image_res.n6;
    this.n7 = this._image_res.n7;
    this.n8 = this._image_res.n8;
    this.n9 = this._image_res.n9;

    this.buttonImage = {};
    this.buttonImage['left'] = this.left_image;
    this.buttonImage['right'] = this.right_image;
    this.buttonImage['down'] = this.down_image;
    this.buttonImage['bottom'] = this.bottom_image;
    this.buttonImage['up'] = this.rotate_image;
    this.buttonImage['rotate'] = this.left_rotate_image;

    this.buttonImage['hold'] = this.hold_image;
    this.buttonImage['play'] = this.play_image;
    this.buttonImage['pause'] = this.pause_image;

    this.buttonImage['blank'] = this.blank_image;
    this.buttonImage['next'] = this.next_image;
    this.buttonImage['hold_text'] = this.hold_text_image;
    this.buttonImage['score'] = this.score_image;
    this.buttonImage['high_score'] = this.high_score_image;

    this.buttonImage['main_menu'] = this.main_menu_image;
    this.buttonImage['arcade'] = this.arcade_image;
    this.buttonImage['puzzle'] = this.puzzle_image;
    this.buttonImage['item_mode'] = this.item_mode_image;
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

    this.back_block = this._image_res.back_block;
    this.blue_block = this._image_res.blue_block;
    this.cyan_block = this._image_res.cyan_block;
    this.gray_block = this._image_res.gray_block;
    this.green_block = this._image_res.green_block;
    this.magenta_block = this._image_res.magenta_block;
    this.orange_block = this._image_res.orange_block;
    this.red_block = this._image_res.red_block;
    this.yellow_block = this._image_res.yellow_block;
    this.boom_block = this._image_res.boom_block;
    this.blue_boom_block = this._image_res.blue_boom_block;
    this.green_boom_block = this._image_res.green_boom_block;
    this.orange_boom_block = this._image_res.orange_boom_block;
    this.red_boom_block = this._image_res.red_boom_block;
    this.thunder_block = this._image_res.thunder_block;
    this.black_thunder_block = this._image_res.black_thunder_block;
    this.orange_thunder_block = this._image_res.orange_thunder_block;
    this.red_thunder_block = this._image_res.red_thunder_block;

    this.block_image = [];
    this.block_image.push(this.gray_block);
    this.block_image.push(this.blue_block);
    this.block_image.push(this.cyan_block);
    this.block_image.push(this.green_block);
    this.block_image.push(this.magenta_block);
    this.block_image.push(this.orange_block); //5
    this.block_image.push(this.red_block);
    this.block_image.push(this.yellow_block);
    this.block_image.push(this.gray_block); // 8
    this.block_image.push(this.boom_block); // 9
    this.block_image.push(this.blue_boom_block); // 10
    this.block_image.push(this.green_boom_block); // 11
    this.block_image.push(this.red_boom_block); // 12
    this.block_image.push(this.orange_boom_block); //13
    this.block_image.push(this.thunder_block); //14
    this.block_image.push(this.black_thunder_block); // 15
    this.block_image.push(this.orange_thunder_block); // 16
    this.block_image.push(this.red_thunder_block); // 17
    this.block_image.push(this.gray_block);
    this.block_image.push(this.gray_block);
    this.block_image.push(this.gray_block); // 20

    console.log("[DRAW_ENGINE] image load success!");
  }

  OnDraw() {
    this._drawBoard();
  }

  __initValue() {
    this.initState = new InitDrawEngine();
    this.idleState = new IdleDrawEngine();
    this.playState = new PlayDrawEngine();
    this.pauseState = new PauseDrawEngine();
    this.gameoverState = new GameoverDrawEngine(); 
    this.state = this.initState;

    let btn_w = blockSize * 2.5;
    let btn_h = blockSize * 2.5;
    let image_size = btn_h - 3;
    let half_bls = blockSize * 0.5;

    this.startX = gStartX;
    this.startY = gStartY;


    this.buttons = [];
    this.buttons.push(new Button('rotate', 0, this.startX-half_bls, this.startY + blockSize * (board_height + 4), image_size, image_size, 0.3));
    this.buttons.push(new Button('left', 0, this.startX-half_bls + btn_w + blockSize * 0.5, this.startY + blockSize * (board_height + 4), image_size, image_size, 0.3));
    this.buttons.push(new Button('down', 0, this.startX-half_bls + btn_w * 2 + blockSize, this.startY + blockSize * (board_height + 4), image_size, image_size, 0.3));
    this.buttons.push(new Button('right', 0, this.startX + btn_w * 3 + blockSize * 2.5, this.startY + blockSize * (board_height + 4), image_size, image_size, 0.3));
    this.buttons.push(new Button('up', 0, this.startX + btn_w * 4 + blockSize * 3, this.startY + blockSize * (board_height + 4), image_size, image_size, 0.3));
    this.buttons.push(new Button('bottom', 0, this.startX-half_bls + btn_w * 2 + blockSize, this.startY + blockSize * (board_height + 1), image_size, image_size, 0.3));

    this.buttons.push(new Button('next',  0, this.startX + blockSize * 11, this.startY, blockSize*4, blockSize, 1.0));
    this.buttons.push(new Button('blank', 0, this.startX + blockSize * 11, this.startY+blockSize, blockSize*4, blockSize*6, 0.5));
    this.buttons.push(new Button('hold_text', 0, this.startX + blockSize * 11, this.startY+blockSize * 8, blockSize*4, blockSize, 1.0));
    this.buttons.push(new Button('blank', 0, this.startX + blockSize * 11, this.startY+blockSize * 9, blockSize*4, blockSize*3, 0.5));

    this.buttons.push(new Button('score', 0, this.startX + blockSize * 11, this.startY+blockSize * 13, blockSize*4, blockSize, 1.0));
    this.buttons.push(new Button('blank', 0, this.startX + blockSize * 11, this.startY+blockSize * 14, blockSize*4, blockSize, 0.5));
    this.buttons.push(new Button('high_score', 0, this.startX + blockSize * 11, this.startY+blockSize * 16, blockSize*4, blockSize, 1.0));
    this.buttons.push(new Button('blank', 0, this.startX + blockSize * 11, this.startY+blockSize * 17, blockSize*4, blockSize, 0.5));
  }

  __drawBackGround() {
    bufCtx.beginPath();
    if (this.tetris.isPuzzleMode()) {
      bufCtx.drawImage(this.back2_image, 0, 0, gScreenX, gScreenY);
    } else if (this.tetris.isItemMode()) {
      bufCtx.drawImage(this.back3_image, 0, 0, gScreenX, gScreenY);
    } else {
      bufCtx.drawImage(this.back_image, 0, 0, gScreenX, gScreenY);
    }

    let startY = this.startY;
    let blockSize = 40;

    bufCtx.globalAlpha = 0.42;
    for (let y = 0; y < board_height; y++) {
      for (let x = 0; x < board_width; x++) {
        bufCtx.drawImage(this.back_block, this.startX + x * blockSize, y * blockSize + startY, blockSize, blockSize);
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
    let drawY = this.startY + blockSize * 14;

    if (score > 1000000) {
      console.log("Score is " + score);
      score = 999999;
    }

    do {
      _canvas.drawImage(button_image[code[score%10]], drawX - pos * imageSize, drawY, imageSize, imageSize);
      score = Math.floor(score / 10);
      pos++;
    } while (score > 0);

    pos = 0;
    drawY = this.startY + blockSize * 17;

    if (high_score > 1000000) {
      console.log("Score is " + high_score);
      high_score = 999999;
    }

    do {
      _canvas.drawImage(button_image[code[high_score%10]], drawX - pos * imageSize, drawY, imageSize, imageSize);
      high_score = Math.floor(high_score / 10);
      pos++;
    } while (high_score > 0);

    _canvas.closePath();
  }

  _drawBoard() {
    this.__drawBackGround();
    this.__drawKeypad();
    this.state.OnDraw(bufCtx, this.tetris, this.block_image, this.buttonImage, this.startX);
    this.__drawScore(bufCtx, this.buttonImage, this.tetris.score, this.tetris.getHighScore());
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
