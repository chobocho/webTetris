let cvs;
let canvas;

let bufCanvas;
let bufCtx;

let blockSize = 40;
let board_height = 18;
let board_width = 10;
let startX = 0;
let tetris;
let drawEngine;

var LoadImage = function (image_name) {
    var load_image = new Image();
    load_image.src = image_name;
    return load_image;
}
