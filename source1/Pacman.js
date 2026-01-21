import MovingDirection from "./MovingDirection.js";

export default class Pacman {
  constructor(x, y, tileSize, velocity, tileMap) {
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.velocity = velocity;
    this.tileMap = tileMap;

    this.currentMovingDirection = MovingDirection.right;

    this.pacmanAnimationTimerDefault = 10;
    this.pacmanAnimationTimer = null;

    this.pacmanRotation = this.Rotation.right;

    this.wakaSound = new Audio("sounds1/waka.wav");
    this.powerDotSound = new Audio("sounds1/power_dot.wav");
    this.eatGhostSound = new Audio("sounds1/eat_ghost.wav");

    this.powerDotActive = false;
    this.powerDotAboutToExpire = false;
    this.timers = [];

    this.madeFirstMove = false;

    this.#loadPacmanImages();
  }

  Rotation = { right: 0, down: 1, left: 2, up: 3 };

  draw(ctx, pause, enemies) {
    if (!pause) {
      this.#autoMove();
      this.#animate();
    }

    this.#eatDot();
    this.#eatPowerDot();
    this.#eatGhost(enemies);

    const size = this.tileSize / 2;

    ctx.save();
    ctx.translate(this.x + size, this.y + size);
    ctx.rotate((this.pacmanRotation * 90 * Math.PI) / 180);
    ctx.drawImage(this.pacmanImages[this.pacmanImageIndex], -size, -size, this.tileSize, this.tileSize);
    ctx.restore();
  }

  #loadPacmanImages() {
    const p0 = new Image();
    p0.src = "image1/pac0.png";
    const p1 = new Image();
    p1.src = "image1/pac1.png";
    const p2 = new Image();
    p2.src = "image1/pac2.png";
    this.pacmanImages = [p0, p1, p2, p1];
    this.pacmanImageIndex = 0;
  }

  #autoMove() {
    if (Number.isInteger(this.x / this.tileSize) && Number.isInteger(this.y / this.tileSize)) {
      const dirs = [MovingDirection.up, MovingDirection.down, MovingDirection.left, MovingDirection.right];
      const valid = dirs.filter((d) => !this.tileMap.didCollideWithEnvironment(this.x, this.y, d));

      if (valid.length > 0) {
        const opposite = this.#opposite(this.currentMovingDirection);
        const prefer = valid.filter((d) => d !== opposite);
        const pool = prefer.length ? prefer : valid;

        if (this.tileMap.didCollideWithEnvironment(this.x, this.y, this.currentMovingDirection) || Math.random() < 0.35) {
          this.currentMovingDirection = pool[Math.floor(Math.random() * pool.length)];
        }
      }
    }

    if (this.tileMap.didCollideWithEnvironment(this.x, this.y, this.currentMovingDirection)) {
      this.pacmanAnimationTimer = null;
      this.pacmanImageIndex = 1;
      return;
    }

    if (this.currentMovingDirection != null && this.pacmanAnimationTimer == null) {
      this.pacmanAnimationTimer = this.pacmanAnimationTimerDefault;
    }

    switch (this.currentMovingDirection) {
      case MovingDirection.up:
        this.y -= this.velocity;
        this.pacmanRotation = this.Rotation.up;
        break;
      case MovingDirection.down:
        this.y += this.velocity;
        this.pacmanRotation = this.Rotation.down;
        break;
      case MovingDirection.left:
        this.x -= this.velocity;
        this.pacmanRotation = this.Rotation.left;
        break;
      case MovingDirection.right:
        this.x += this.velocity;
        this.pacmanRotation = this.Rotation.right;
        break;
    }
  }

  #opposite(dir) {
    if (dir === MovingDirection.up) return MovingDirection.down;
    if (dir === MovingDirection.down) return MovingDirection.up;
    if (dir === MovingDirection.left) return MovingDirection.right;
    if (dir === MovingDirection.right) return MovingDirection.left;
    return null;
  }

  #animate() {
    if (this.pacmanAnimationTimer == null) return;
    this.pacmanAnimationTimer--;
    if (this.pacmanAnimationTimer === 0) {
      this.pacmanAnimationTimer = this.pacmanAnimationTimerDefault;
      this.pacmanImageIndex = (this.pacmanImageIndex + 1) % this.pacmanImages.length;
    }
  }

  #eatDot() {
    if (this.tileMap.eatDot(this.x, this.y) && this.madeFirstMove) this.wakaSound.play();
  }

  #eatPowerDot() {
    if (this.tileMap.eatPowerDot(this.x, this.y)) {
      this.powerDotSound.play();
      this.powerDotActive = true;
      this.powerDotAboutToExpire = false;

      this.timers.forEach((t) => clearTimeout(t));
      this.timers = [];

      this.timers.push(
        setTimeout(() => {
          this.powerDotActive = false;
          this.powerDotAboutToExpire = false;
        }, 6000)
      );

      this.timers.push(
        setTimeout(() => {
          this.powerDotAboutToExpire = true;
        }, 3000)
      );
    }
  }

  #eatGhost(enemies) {
    if (!this.powerDotActive) return;
    const hits = enemies.filter((e) => e.collideWith(this));
    hits.forEach((enemy) => {
      enemies.splice(enemies.indexOf(enemy), 1);
      this.eatGhostSound.play();
    });
  }
}
