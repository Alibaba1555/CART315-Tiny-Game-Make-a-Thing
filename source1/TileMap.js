import Pacman from "./Pacman.js";
import Enemy from "./Enemy.js";
import MovingDirection from "./MovingDirection.js";

export default class TileMap {
  constructor(tileSize) {
    this.tileSize = tileSize;

    this.yellowDot = new Image();
    this.yellowDot.src = "./image1/yellowDot.png";

    this.pinkDot = new Image();
    this.pinkDot.src = "./image1/pinkDot.png";

    this.wall = new Image();
    this.wall.src = "./image1/wall.png";

    this.powerDot = this.pinkDot;
    this.powerDotAnmationTimerDefault = 30;
    this.powerDotAnmationTimer = this.powerDotAnmationTimerDefault;

    this.editCooldownMs = 600;
    this.lastEditAt = new Map();

    this.wallStock = 0;
    this.blockers = new Set();
  }

  map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 7, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 7, 0, 1, 0, 1, 0, 1, 1],
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
    [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  draw(ctx) {
    for (let row = 0; row < this.map.length; row++) {
      for (let col = 0; col < this.map[row].length; col++) {
        const key = `${row},${col}`;
        const tile = this.map[row][col];

        if (tile === 1 || this.blockers.has(key)) {
          this.#drawWall(ctx, col, row, this.tileSize);
        } else if (tile === 0) {
          this.#drawDot(ctx, col, row, this.tileSize);
        } else if (tile === 7) {
          this.#drawPowerDot(ctx, col, row, this.tileSize);
        } else {
          this.#drawBlank(ctx, col, row, this.tileSize);
        }
      }
    }
  }

  #drawDot(ctx, col, row, size) {
    ctx.drawImage(this.yellowDot, col * size, row * size, size, size);
  }

  #drawWall(ctx, col, row, size) {
    ctx.drawImage(this.wall, col * size, row * size, size, size);
  }

  #drawPowerDot(ctx, col, row, size) {
    this.powerDotAnmationTimer--;
    if (this.powerDotAnmationTimer === 0) {
      this.powerDotAnmationTimer = this.powerDotAnmationTimerDefault;
      this.powerDot = this.powerDot === this.pinkDot ? this.yellowDot : this.pinkDot;
    }
    ctx.drawImage(this.powerDot, col * size, row * size, size, size);
  }

  #drawBlank(ctx, col, row, size) {
    ctx.fillStyle = "black";
    ctx.fillRect(col * size, row * size, size, size);
  }

  getPacman(velocity) {
    for (let row = 0; row < this.map.length; row++) {
      for (let col = 0; col < this.map[row].length; col++) {
        if (this.map[row][col] === 4) {
          this.map[row][col] = 0;
          return new Pacman(col * this.tileSize, row * this.tileSize, this.tileSize, velocity, this);
        }
      }
    }
  }

  getEnemies(velocity) {
  const enemies = [];

  for (let row = 0; row < this.map.length; row++) {
    for (let col = 0; col < this.map[row].length; col++) {
      const tile = this.map[row][col];
      if (tile === 6) {
        this.map[row][col] = 0;
        enemies.push(new Enemy(col * this.tileSize, row * this.tileSize, this.tileSize, velocity, this));
      }
    }
  }

  if (enemies.length === 0) {
    const row = Math.floor(this.map.length / 2);
    const col = Math.floor(this.map[0].length / 2);
    enemies.push(new Enemy(col * this.tileSize, row * this.tileSize, this.tileSize, velocity, this));
    enemies.push(new Enemy((col - 1) * this.tileSize, row * this.tileSize, this.tileSize, velocity, this));
    enemies.push(new Enemy((col + 1) * this.tileSize, row * this.tileSize, this.tileSize, velocity, this));
    enemies.push(new Enemy(col * this.tileSize, (row - 1) * this.tileSize, this.tileSize, velocity, this));
  }

  return enemies;
}


  setCanvasSize(canvas) {
    canvas.width = this.map[0].length * this.tileSize;
    canvas.height = this.map.length * this.tileSize;
  }

  #isBorder(row, col) {
    return row === 0 || col === 0 || row === this.map.length - 1 || col === this.map[0].length - 1;
  }

  #isBlockedTile(row, col) {
    const key = `${row},${col}`;
    return this.map[row][col] === 1 || this.blockers.has(key);
  }

  didCollideWithEnvironment(x, y, direction) {
    if (direction == null) return;

    if (!Number.isInteger(x / this.tileSize) || !Number.isInteger(y / this.tileSize)) return false;

    let col = x / this.tileSize;
    let row = y / this.tileSize;

    if (direction === MovingDirection.right) col = (x + this.tileSize) / this.tileSize;
    else if (direction === MovingDirection.left) col = (x - this.tileSize) / this.tileSize;
    else if (direction === MovingDirection.up) row = (y - this.tileSize) / this.tileSize;
    else if (direction === MovingDirection.down) row = (y + this.tileSize) / this.tileSize;

    if (row < 0 || col < 0 || row >= this.map.length || col >= this.map[0].length) return true;
    return this.#isBlockedTile(row, col);
  }

  eatDot(x, y) {
    const row = y / this.tileSize;
    const col = x / this.tileSize;
    if (!Number.isInteger(row) || !Number.isInteger(col)) return false;

    if (this.blockers.has(`${row},${col}`)) return false;

    if (this.map[row][col] === 0) {
      this.map[row][col] = 5;
      return true;
    }
    return false;
  }

  eatPowerDot(x, y) {
    const row = y / this.tileSize;
    const col = x / this.tileSize;
    if (!Number.isInteger(row) || !Number.isInteger(col)) return false;

    if (this.blockers.has(`${row},${col}`)) return false;

    if (this.map[row][col] === 7) {
      this.map[row][col] = 5;
      return true;
    }
    return false;
  }

  didWin() {
    return this.map.flat().filter((t) => t === 0).length === 0;
  }

  tryEditWall(row, col, nowMs = performance.now()) {
    if (row < 0 || col < 0 || row >= this.map.length || col >= this.map[0].length) return { ok: false };
    if (this.#isBorder(row, col)) return { ok: false };

    const key = `${row},${col}`;
    const last = this.lastEditAt.get(key) ?? -Infinity;
    if (nowMs - last < this.editCooldownMs) return { ok: false, reason: "cooldown" };

    if (this.map[row][col] === 1) {
      this.map[row][col] = 5;
      this.wallStock++;
      this.lastEditAt.set(key, nowMs);
      return { ok: true, action: "pickup", stock: this.wallStock };
    }

    if (this.blockers.has(key)) {
      this.blockers.delete(key);
      this.wallStock++;
      this.lastEditAt.set(key, nowMs);
      return { ok: true, action: "pickup", stock: this.wallStock };
    }

    if (this.wallStock <= 0) return { ok: false, reason: "no_stock" };

    this.blockers.add(key);
    this.wallStock--;
    this.lastEditAt.set(key, nowMs);
    return { ok: true, action: "place", stock: this.wallStock };
  }
}
