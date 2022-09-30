class Score {
  constructor() {
    this.score = 0;
    this.highscore = 0;
    this.removedLineCount = 0;
    this.scoreTable = new Array(0, 1, 2, 5, 10);
  }

  init() {
      this.score = 0;
      this.removedLineCount = 0;
  }

  get() {
    return this.score;
  }

  getHighScore() {
    return this.highscore;
  }

  increase(removeLines) {
     this.score += this.scoreTable[removeLines];
     this.__updateHighScore();
  }

  add(score) {
    this.score += score;
    this.__updateHighScore();
 }
  __updateHighScore() {
    this.highscore = this.highscore > this.score ? this.highscore : this.score;
  }
}
