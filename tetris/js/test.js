function test_Tetrominos() {
  let block = new Tetrominos();
  block.moveLeft();
}

function test_Tetris() {
  let tetris = new Tetris(board_width, board_height);

  let observer = new Observer();
  tetris.register(observer);

  tetris.notify();
  console.log(test_Tetris.name + " Pass");
}

function test_Score() {
  console.log(test_Score.name + " Pass");
}

function test_TetrisBoard() {
  board = new TetrisBoard(board_width, board_height);
  board.init();

  block = new IBlock(board_width, board_height);
  console.assert(board.isAcceptable(block) == true, "Error");
}

function test_State() {
  let state = new State();
  console.assert(state.isGameOverState() == false, "Error");
  console.log(test_State.name + " Pass");
}

function test_IdleState() {
  let tetris = null;
  let state = new IdleState(tetris);
  console.assert(state.isGameOverState() == false, "Error");
  console.assert(state.isIdleState() == true, "Error");
  console.log(test_IdleState.name + " Pass");
}

function test_PlayState() {
  let tetris = null;
  let state = new PlayState(tetris);
  console.assert(state.isGameOverState() == false, "Error");
  console.assert(state.isPlayState() == true, "Error");
  console.log(test_PlayState.name + " Pass");
}

function onLoadPage() {
    test_Tetrominos();
    test_State();
    test_IdleState();
    test_PlayState();
    test_Score();
    test_TetrisBoard();
    test_Tetris();
}

window.onload = onLoadPage;
