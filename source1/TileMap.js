import Pacman from "./Pacman.js";
import Enemy from "./Enemy.js";
import MovingDirection from "./MovingDirection.js";

export default class TileMap{
    constructor(tileSize){
    this.tileSize = tileSize;
    
    this.yellowDot = new Image();
    this.yellowDot.src = "./image1/yellowDot.png"; //import form yellowDot photo

    this.pinkDot = new Image();
    this.pinkDot.src = "./image1/pinkDot.png";

    this.wall = new Image();
    this.wall.src = "./image1/wall.png"; //import form wall photo

    this.powerDot = this.pinkDot; 
    this.powerDotAnmationTimerDefault = 30; //dot flash animation (speed)
    this.powerDotAnmationTimer = this.powerDotAnmationTimerDefault;

    }
/**
 * Using arrays to draw the map
 * 1 = brick/wall
 * 0 = Dots
 * 4 = pac-man
 * 5 = empty space
 * 6 = enemies
 * 7 = power dot (so Pacman can eat the ghost by eating this)
 */
    map = [
        
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 7, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 7, 0, 1, 0, 1, 0, 1, 1],
            [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 6, 6, 6, 6, 0, 0, 1, 0, 1, 0, 0, 1],
            [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 7, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1],
            [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 7, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        
    ];
    
    draw(ctx){
        //number of arrays in the map here
        for (let row=0; row < this.map.length; row++){
            for(let column=0; column < this.map[row].length; column++){
                let tile = this.map [row][column];
                //draw the wall
                if(tile===1){
                    this.#drawWall(ctx,column,row,this.tileSize);
                }
                // draw the color for the Dots
                else if (tile === 0){
                    this.#drawDot(ctx, column, row, this.tileSize);
                } else if (tile == 7) {
                    this.#drawPowerDot(ctx, column, row, this.tileSize);
                } else {
                    this.#drawBlank(ctx, column, row, this.tileSize); // Draw a black rectangle for 5(empty space)
                  }
            }
        }
    }

    // draw the Dots , array number : 0
    #drawDot(ctx, column, row, size) { 
        // size represent width and height, so 2 times here
        ctx.drawImage(
        this.yellowDot,
        column * this.tileSize,
        row * this.tileSize,
        size,
        size
      );
    }

    #drawPowerDot(ctx, column, row, size) {
        this.powerDotAnmationTimer--;
         // If the timer reaches 0, reset it and toggle the power dot's color
        if (this.powerDotAnmationTimer === 0) {
          this.powerDotAnmationTimer = this.powerDotAnmationTimerDefault; // Reset the timer to its default(back to 30)
          // Toggle between pink and yellow power dots
          if (this.powerDot == this.pinkDot) {
            this.powerDot = this.yellowDot; // Switch to yellow
          } else {
            this.powerDot = this.pinkDot; // Switch to pink
          }
        }
        // Draw the current power dot
        ctx.drawImage(this.powerDot, column * size, row * size, size, size);
      }

    // draw the wall , array number : 1
    #drawWall(ctx,column,row,size){
        // size represent width and height, so 2 times here
        ctx.drawImage(
            this.wall,
            column * this.tileSize,
            row * this.tileSize,
            size,
            size
          );
    }

    // Draw a black rectangle when we eat the dots / had a collision with the dots
    #drawBlank(ctx, column, row, size) {
        ctx.fillStyle = "black"; // Like the canvas color
        ctx.fillRect(column * this.tileSize, row * this.tileSize, size, size);
      }

    // build Pacman
    getPacman(velocity){
        // Iterate over each row of the map
        for (let row = 0; row < this.map.length; row++) {
            // Traverse each column of the current row
            for (let column = 0; column < this.map[row].length; column++){
                let tile = this.map[row][column]; // Get the map element of the current location
                // If we find a map element with value 4 (indicating Pac-Man's starting position)
                if (tile === 4) {
                    this.map[row][column] = 0;
                    return new Pacman(
                        column * this.tileSize,
                        row * this.tileSize,
                        this.tileSize,
                        velocity,
                        this
                      );
                }
            }
        }
    }

    // build enemy
    getEnemies(velocity) {
        const enemies = []; // Initialize an empty array to store the enemy 

        for (let row = 0; row < this.map.length; row++) {
            for (let column = 0; column < this.map[row].length; column++) {
                const tile = this.map[row][column]; 
                // check if the tile is an enemy (6)
                if (tile == 6) {
                    this.map[row][column] = 0; // Reset the tile to an empty space (value 0)
                     // Create a new enemy object and add it to the array
                    enemies.push(
                        new Enemy(
                          column * this.tileSize,
                          row * this.tileSize,
                          this.tileSize,
                          velocity,
                          this
                        )
                    );
                }
            }
        }
        return enemies; // Return the array of created enemy
    }

    setCanvasSize(canvas) {
        canvas.width = this.map[0].length * this.tileSize; //20 bricks from arrays = width of the map
        canvas.height = this.map.length * this.tileSize; // 17 bricks from arrays = height of the map
    }

    // Check if Pacman collides with the environment
    didCollideWithEnvironment(x, y, direction) {

        if (direction == null) {
            return;
          }

        // Check if it is in the square
        if (
            Number.isInteger(x / this.tileSize) &&
            Number.isInteger(y / this.tileSize)
          ) {
            let column = 0;
            let row = 0;
            let nextColumn = 0;
            let nextRow = 0;

            switch (direction) {
                case MovingDirection.right: // If the movement direction is right
                  nextColumn = x + this.tileSize; // Calculate the column of the next position (x coordinate plus a tileSize)
                  column = nextColumn / this.tileSize; // Divide the new column position by tileSize to get the column index
                  row = y / this.tileSize; // Calculate the row index using the current y coordinate
                  break;
                case MovingDirection.left:
                  nextColumn = x - this.tileSize;
                  column = nextColumn / this.tileSize;
                  row = y / this.tileSize;
                  break;
                case MovingDirection.up:
                  nextRow = y - this.tileSize;
                  row = nextRow / this.tileSize;
                  column = x / this.tileSize;
                  break;
                case MovingDirection.down:
                  nextRow = y + this.tileSize;
                  row = nextRow / this.tileSize;
                  column = x / this.tileSize;
                  break;
              }
            // Get the tile type of the current position
            const tile = this.map[row][column];
            // If the current position is a wall (tile === 1), a collision has occurred
            if (tile === 1) {
            return true; // Return true, indicating a collision occurred
            }
      }
      return false; // If there is no collision, return false
    }

    // Eat dot (Pacman)
    eatDot(x, y) {
        const row = y / this.tileSize; // To figure out the row
        const column = x / this.tileSize; // To figure out the column

        // check if it's in a square
        if (Number.isInteger(row) && Number.isInteger(column)) {
          if (this.map[row][column] === 0) {
            this.map[row][column] = 5; // set to an empty space
            return true; // If player eat a dot, draw rectangle
          }
        }
        return false; // If not, don't draw
      }

    // Eat Power dot (Pacman)
    eatPowerDot(x, y) {
    const row = y / this.tileSize;
    const column = x / this.tileSize;
    // check if pacman is in a square
    if (Number.isInteger(row) && Number.isInteger(column)) {
      const tile = this.map[row][column];
      // check if it's power dot
      if (tile === 7) {
        this.map[row][column] = 5; //replace it by empty space
        return true; 
      }
    }
    return false; // hasn't been eaten so false, keep 7
  }

    //condition for game win
    didWin() {
      return this.#dotsLeft() === 0; // number of dot left = 0
  }

    #dotsLeft() {
    // Flatten the map into a single array and count how many tiles have a value of 0 (dots)
      return this.map.flat().filter((tile) => tile === 0).length;
  }
}