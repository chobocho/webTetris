class Score {
  constructor(prev_high_score) {
    this._score = 0;
    this.highscore = prev_high_score;
    this.scoreTable = [0, 5, 10, 50, 100, 110, 130, 170, 210, 270, 340, 420, 500, 510, 520, 530, 540, 550, 600, 700, 800, 900];
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
     this._score += this.scoreTable[removeLines];
     if (removeLines > 2) {
       this._score += Math.floor(Math.random() * this.scoreTable[removeLines] + 1);
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
