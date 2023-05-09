function processEvent(code) {
  switch (code) {
    case 17:
      console.log("hold");
      gameEngine.hold();
      break;
    case 88:
    case 32:
      if (tetris.isInitState() || tetris.isIdleState()) {
        // Do nothing
      } else if (tetris.isPlayState()) {
        console.log("Bottom And Fix");
        gameEngine.moveBottomAndFix();
      } else {
        gameEngine.start();
      }
      break;
    case 37:
      console.log("Left");
      gameEngine.moveLeft();
      break;
    case 38:
      console.log("Up");
      gameEngine.rotate();
      break;
    case 39:
      console.log("Right");
      gameEngine.moveRight();
      break;
    case 40:
      console.log("Down");
      // FOR NHK
      gameEngine.moveDown();
      break;
    case 65:
      if (tetris.isInitState()) {
        console.log("Start Arcade Mode");
        tetris = arcadeTetris;
        gameEngine = arcadeGameEngine;
        drawEngine = arcadeDrawEngine;
        gameEngine.init();
      }
      break;
    case 73:
      console.log("Start Item Mode");
      if (tetris.isInitState()) {
        tetris = itemTetris;
        gameEngine = itemGameEngine;
        drawEngine = itemDrawEngine;
        gameEngine.init();
      }
      break;
    case 76:
      console.log("Load");
      gameEngine.load();
      break;
    case 77:
      console.log("Go to Main Menu");
      gameEngine.main_menu();
      break;
    case 78:
      console.log("NewGame");
      gameEngine.newGame();
      break;
    case 27:
    case 80:
      console.log("Pause");
      gameEngine.pause();
      break;
    case 82:
      console.log("Resume");
      gameEngine.resume();
      break;
    case 13:
    case 83:
      console.log("Start");
      gameEngine.start();
      break;
    case 85:
      console.log("Start Puzzle Mode");
      if (tetris.isInitState()) {
        tetris = puzzleTetris;
        gameEngine = puzzleGameEngine;
        drawEngine = puzzleDrawEngine;
        gameEngine.init();
      }
      break;
    case 90:
      console.log("left_rotate");
      gameEngine.left_rotate();
      break;
    default:
      break;
  }
}

function KeyPressEvent(e) {
  const code = e.keyCode;
  processEvent(code);
}

function processMouseEvent(x, y) {
  let code = drawEngine.getEventCode(x, y);
  console.log("processMouseEvent ", code);
  processEvent(code);
}

function getMousePosition(event) {
  let x = event.pageX - canvas.offsetLeft;
  let y = event.pageY - canvas.offsetTop;
  return {X: x, Y: y};
}

function mouseListener(event) {
  switch (event.type) {
    case "mousedown":
      break;
    case "mousemove":
      break;
    case "mouseup":
      let pos = getMousePosition(event)
      processMouseEvent(pos.X, pos.Y);
      break;
    case "mouseout":
      break;
  }
}

function InitValue() {
  let imageLoader = new ImageLoader();
  imageLoader.load();

  let itemBlockFactory = new ItemTetrisBlockFactory();
  let blockFactory = new TetrisBlockFactory();

  arcadeModeDB = new ArcadeDB();
  arcadeBoardManager = new BoardManager();
  arcadeTetris = new Tetris(board_width, board_height, arcadeModeDB, arcadeBoardManager, blockFactory);
  arcadeDrawEngine = new DrawEngine(arcadeTetris, imageLoader);
  arcadeGameEngine = new GameEngine(arcadeTetris, arcadeModeDB);

  puzzleModeDB = new PuzzleDB();
  puzzleBoardManager = new PuzzleBoardManager();
  puzzleBoardManager.setMapData(boardMap);
  puzzleTetris = new Tetris(board_width, board_height, puzzleModeDB, puzzleBoardManager, blockFactory);
  puzzleDrawEngine = new DrawEngine(puzzleTetris, imageLoader);
  puzzleGameEngine = new GameEngine(puzzleTetris, puzzleModeDB);

  itemModeDB = new ItemTetrisDB();
  itemBoardManager = new ItemBoardManager();
  itemBoardManager.setMapData(boardMap);
  itemTetris = new Tetris(board_width, board_height, itemModeDB, itemBoardManager, itemBlockFactory);
  itemDrawEngine = new DrawEngine(itemTetris, imageLoader);
  itemGameEngine = new GameEngine(itemTetris, itemModeDB);

  tetris = arcadeTetris;
  gameEngine = arcadeGameEngine;
  drawEngine = arcadeDrawEngine;
  tetris.init();

  canvas.addEventListener("mousedown", mouseListener);
  canvas.addEventListener("mousemove", mouseListener);
  canvas.addEventListener("mouseout", mouseListener);
  canvas.addEventListener("mouseup", mouseListener);

  window.onkeydown = KeyPressEvent;

  window.addEventListener('resize', resizeCanvas, false);
}

function InitCanvas() {
  resizeCanvas();
  cvs = canvas.getContext("2d");

  bufCanvas = document.createElement("canvas");
  bufCanvas.width = gScreenX;
  bufCanvas.height = gScreenY;
  bufCtx = bufCanvas.getContext("2d");
}

function OnDraw() {
  gameEngine.tick();
  drawEngine.OnDraw();
}

function resizeCanvas() {
  canvas = document.getElementById("canvas");

  let height = window.innerHeight;
  let width = window.innerWidth;

  if (width < 170 || height < 270) {
    printf("[main]", "Error: width == 0");
    width = 170;
    height = 270;
  }

  let bsX = width / 17;
  let bsY = height / 28;
  let bs = bsX < bsY ? bsX : bsY;
  bs = Math.round(bs) - 1;

  canvas.width = bs*17;
  canvas.height = bs*27;

  let log_msg = "Canvas Width: " + canvas.width + " Height: " + canvas.height;
  printf("[main] resizeCanvas: ", log_msg);
  log_msg = "Width: " + width + " Height: " + height;
  printf("Window [main] resizeCanvas: ", log_msg);
  DecisionBlockSize();
}

function DecisionBlockSize() {
  // 17 = 1 + 10 + 1 + 4 + 1
  let bsX = canvas.width / 17;
  // 27 = 1 + 18 + 1 + 3 + 3 + 1
  let bsY = canvas.height / 27;
  let bs = bsX < bsY ? bsX : bsY;
  gCanvasStartX = (canvas.width - bs * 17) / 2;
  gScale = bs / 40;
  gBlockSize = bs;

  printf("[main] DecisionBlockSize", "gCanvasStartX:" + gCanvasStartX + ", scale: " + gScale + ", blockSize: " + bs);
}

function onLoadPage() {
  InitCanvas();
  InitValue();
  setInterval(OnDraw, 20);
}

window.onload = onLoadPage;
