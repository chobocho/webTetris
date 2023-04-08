class Score {
  constructor(prev_high_score) {
    this.score = 0;
    this.highscore = prev_high_score;
    this.scoreTable = [0, 1, 8, 30, 100];
    this._prev_high_score = prev_high_score;
  }

  init() {
      this.score = 0;
      this._prev_high_score = this.highscore;
  }

  get() {
    return this.score;
  }

  getHighScore() {
    return this.highscore;
  }

  increase(removeLines) {
     this.score += this.scoreTable[removeLines];
     if (removeLines > 2) {
       this.score += Math.floor(Math.random() * this.scoreTable[removeLines] + 1);
     }
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
