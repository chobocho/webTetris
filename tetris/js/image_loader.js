class ImageLoader {
    constructor() {
        this._images = {};
    }

    load() {
        this._images.back = LoadImage("img/back.jpg");
        this._images.back2 = LoadImage("img/back2.png");
        this._images.back3 = LoadImage("img/back3.png");

        this._images.left = LoadImage("img/left.png");
        this._images.right = LoadImage("img/right.png");
        this._images.down = LoadImage("img/down.png");
        this._images.bottom = LoadImage("img/bottom.png");

        this._images.rotate = LoadImage("img/rotate.png");
        this._images.play = LoadImage("img/play.png");
        this._images.pause = LoadImage("img/pause.png");
        this._images.hold = LoadImage("img/hold.png");

        this._images.blank = LoadImage("img/blank.png");
        this._images.next = LoadImage("img/next.png");
        this._images.hold_text = LoadImage("img/hold_text.png");
        this._images.score = LoadImage("img/score.png");
        this._images.high_score = LoadImage("img/high_score.png");

        this._images.start = LoadImage("img/start.png");
        this._images.arcade = LoadImage("img/arcade_mode.png");
        this._images.puzzle = LoadImage("img/puzzle_mode.png");
        this._images.item_mode = LoadImage("img/item_mode.png");
        this._images.resume = LoadImage("img/resume.png");
        this._images.new_game = LoadImage("img/new_game.png");
        this._images.gameover = LoadImage("img/gameover.png");

        this._images.n0 = LoadImage("img/sn00.png");
        this._images.n1 = LoadImage("img/sn01.png");
        this._images.n2 = LoadImage("img/sn02.png");
        this._images.n3 = LoadImage("img/sn03.png");
        this._images.n4 = LoadImage("img/sn04.png");
        this._images.n5 = LoadImage("img/sn05.png");
        this._images.n6 = LoadImage("img/sn06.png");
        this._images.n7 = LoadImage("img/sn07.png");
        this._images.n8 = LoadImage("img/sn08.png");
        this._images.n9 = LoadImage("img/sn09.png");

        this._images.back_block = LoadImage("img/black.png");
        this._images.blue_block = LoadImage("img/blue.png");
        this._images.cyan_block = LoadImage("img/cyan.png");
        this._images.gray_block = LoadImage("img/gray.png");
        this._images.green_block = LoadImage("img/green.png");
        this._images.magenta_block = LoadImage("img/magenta.png");
        this._images.orange_block = LoadImage("img/orange.png");
        this._images.red_block = LoadImage("img/red.png");
        this._images.yellow_block = LoadImage("img/yellow.png");
        this._images.boom_block = LoadImage("img/boom.png");
        this._images.blue_boom_block = LoadImage("img/blue_boom.png");
        this._images.green_boom_block = LoadImage("img/green_boom.png");
        this._images.orange_boom_block = LoadImage("img/orange_boom.png");
        this._images.red_boom_block = LoadImage("img/red_boom.png");
        console.log("[ImageLoader] load images!");
    }
}