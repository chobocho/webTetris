let cvs;
let canvas;

let bufCanvas;
let bufCtx;

let gBlockSize = 40;
let gScale = 1.0;
let gScreenX = 680;
let gScreenY = 1080;
let gCanvasStartX = 0;
let gStartX = 40;
let gStartY = 40;
let blockSize = 40;
let board_height = 18;
let board_width = 10;
let arcadeTetris;
let arcadeDrawEngine;
let arcadeGameEngine;
let arcadeModeDB;
let arcadeBoardManager;

let puzzleTetris;
let puzzleDrawEngine;
let puzzleGameEngine;
let puzzleModeDB;
let puzzleBoardManager;

let itemTetris;
let itemDrawEngine;
let itemGameEngine;
let itemModeDB;
let itemBoardManager;

let tetris;
let drawEngine;
let gameEngine;

const FIXED_BLOCK = 20;

let LoadImage = function (image_name) {
    let load_image = new Image();
    load_image.src = image_name;
    return load_image;
}
