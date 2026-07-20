class Score {
  constructor(prev_high_score) {
    this._score = 0;
    this.highscore = prev_high_score;
    this.scoreTable = [0, 30, 100, 150, 400, 500, 600, 700, 777, 888, 900, 999, 1000, 1088, 1100, 1111, 1200, 1216, 1300, 1400, 1500, 1600, 1700];
    this._prev_high_score = prev_high_score;
  }

  init() {
      this._score = 0;
      this._prev_high_score = this.highscore;
  }

  get score() {
    return this._score;
  }

  set score(new_score) {
    this._score = new_score;
  }

  getHighScore() {
    return this.highscore;
  }

  increase(removeLines) {
     const index = Math.max(0, Math.min(removeLines, this.scoreTable.length - 1));
     this._score += this.scoreTable[index];
     if (index > 2) {
       this._score += Math.floor(Math.random() * this.scoreTable[index] + 1);
     }
     this._updateHighScore();
  }

  add(points) {
    this._score += points;
    this._updateHighScore();
  }

  _updateHighScore() {
    this.highscore = this.highscore > this._score ? this.highscore : this._score;
  }
  needToSave() {
    return this._prev_high_score < this.highscore;
  }
}
