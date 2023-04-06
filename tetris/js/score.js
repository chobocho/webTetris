class Score {
  constructor(prev_high_score) {
    this.score = 0;
    this.highscore = prev_high_score;
    this.removedLineCount = 0;
    this.scoreTable = [0, 1, 10, 30, 50];
    this._prev_high_score = prev_high_score;
  }

  init() {
      this.score = 0;
      this.removedLineCount = 0;
      this._prev_high_score = this.highscore;
  }

  get() {
    return this.score;
  }

  getHighScore() {
    return this.highscore;
  }

  increase(removeLines) {
     this.removedLineCount += removeLines;
     this.score += this.scoreTable[removeLines];
     this._updateHighScore();
  }

  set(new_score) {
    this.score = new_score;
  }
  _updateHighScore() {
    this.highscore = this.highscore > this.score ? this.highscore : this.score;
  }
  needToSave() {
    return this._prev_high_score < this.highscore;
  }
}
