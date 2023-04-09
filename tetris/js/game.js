const isMobileOS = () => {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) {
    return true;
  }
  else if ((/iPad|iPhone|iPod/.test(ua)) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    return true;
  }
  return false;
}

function processEvent(code) {
  switch (code) {
    case 17:
      console.log("hold");
      gameEngine.hold();
      break;
    case 32:
      console.log("Bottom");
      gameEngine.moveBottom();
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
      gameEngine.moveDown();
      break;
    case 65:
      console.log("Arcade Mode");
      gameEngine.init();
      break;
    case 78:
      console.log("NewGame");
      gameEngine.newGame();
      break;
    case 80:
      console.log("Pause");
      gameEngine.pause();
      break;
    case 82:
      console.log("Resume");
      gameEngine.resume();
      break;
    case 83:
      console.log("Start");
      gameEngine.start();
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
  arcadeModeDB = new LocalDB();
  tetris = new Tetris(board_width, board_height, arcadeModeDB);
  drawEngine = new DrawEngine(tetris);
  gameEngine = new GameEngine(tetris, arcadeModeDB);

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
