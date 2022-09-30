class Score {
  constructor() {
    this.score = 0;
    this.highscore = 0;
    this.removedLineCount = 0;
    this.scoreTable = [0, 1, 2, 5, 10];
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
     this._updateHighScore();
  }

  add(score) {
    this.score += score;
    this._updateHighScore();
 }
  _updateHighScore() {
    this.highscore = this.highscore > this.score ? this.highscore : this.score;
  }
}
