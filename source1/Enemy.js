import MovingDirection from "./MovingDirection.js";

export default class Enemy {

     // Constructor initializes the properties for the Enemy object
    constructor(x, y, tileSize, velocity, tileMap) {
        this.x = x;
        this.y = y;
        this.tileSize = tileSize;
        this.velocity = velocity;
        this.tileMap = tileMap;
        
        this.#loadImages();

          // Randomly assign an initial moving direction for the enemy
        this.movingDirection = Math.floor(
            Math.random() * Object.keys(MovingDirection).length // Random value between 0 and the number of directions
          );

          this.directionTimerDefault = this.#random(10, 25); // Duration between 10 and 25 frames / change the difficulty, how long it takes for the enemy to change direction
          this.directionTimer = this.directionTimerDefault

          this.scaredAboutToExpireTimerDefault = 10;
          this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault;

    }

    draw(ctx, pause, pacman) {
        // check game start
        if (!pause) {
        this.#move();
        this.#changeDirection();
        }

        this.#setImage(ctx, pacman);
        ctx.drawImage(
            this.image,
            this.x,
            this.y,
            this.tileSize,
            this.tileSize
          );
    }

    // Check if the ghost collides with the Pacman
    collideWith(pacman) {
        const size = this.tileSize / 2; // Calculate the half size of a tile to use for collision detection
        // Check if the ghost's coordinates overlap with Pacman's coordinates
        if (
          this.x < pacman.x + size && // check if ghost left side is within pacman right side
          this.x + size > pacman.x && // check if ghost right side is within pacman left side
          this.y < pacman.y + size && //top side - down side
          this.y + size > pacman.y //down side - top side
        ) {
          return true; // If there is overlap, a collision occurred
        } else {
          return false; // If there is not an overlap, false
        }
      }

    #setImage(ctx, pacman) {
        // If the power dot is active, set the blue ghost
        if (pacman.powerDotActive) {
            this.#setImageWhenPowerDotIsActive(pacman);
        } else {
          this.image = this.normalGhost; // Otherwise, set the normal ghost image
        }
        ctx.drawImage(this.image, this.x, this.y, this.tileSize, this.tileSize);
      } 

       // Set the image when the power dot is active
    #setImageWhenPowerDotIsActive(pacman) {
        // If the power dot is about to expire, change the ghost's image between scared states
        if (pacman.powerDotAboutToExpire) {
          this.scaredAboutToExpireTimer--;
          if (this.scaredAboutToExpireTimer === 0) {
            this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault; // Reset the timer to default
             // Alternate the scared ghost images
            if (this.image === this.scaredGhost) {
              this.image = this.scaredGhost2; // white
            } else {
              this.image = this.scaredGhost; // blue
            }
          }
        } else {
          this.image = this.scaredGhost;  // Set the normal scared ghost image
        }
      }

    #changeDirection() {
        this.directionTimer--;
        let newMoveDirection = null;
        if (this.directionTimer == 0) {
          this.directionTimer = this.directionTimerDefault;
          newMoveDirection = Math.floor(
            Math.random() * Object.keys(MovingDirection).length // Pick a random direction
          );
        }
    
         // Check if a new direction is set and is different from the current direction
        if (newMoveDirection != null && this.movingDirection != newMoveDirection) {
            // Ensure the enemy is inside a tile
          if (
            Number.isInteger(this.x / this.tileSize) &&
            Number.isInteger(this.y / this.tileSize)
          ) {

            // Check if the new direction does not cause a collision
            if (
              !this.tileMap.didCollideWithEnvironment(
                this.x,
                this.y,
                newMoveDirection
              )
            ) {
              this.movingDirection = newMoveDirection; // Update the moving direction to the new direction
            }
          }
        }
      }

    #move() {
        // Check if the enemy can move in the current direction without colliding
        if (
          !this.tileMap.didCollideWithEnvironment(
            this.x, // x of the enemy
            this.y, // y of the enemy
            this.movingDirection // direction of the enemy
          )
        ) {
          // Move the enemy based on its current moving direction
          switch (this.movingDirection) {
            case MovingDirection.up:
              this.y -= this.velocity; // Move up 
              break;
            case MovingDirection.down:
              this.y += this.velocity;
              break;
            case MovingDirection.left:
              this.x -= this.velocity;
              break;
            case MovingDirection.right:
              this.x += this.velocity;
              break;
          }
        }
      }

    // random move
    #random(min, max) {
         // Generate a random integer
        return Math.floor(Math.random() * (max - min + 1)) + min;
      } 

    // Load ghost images
    #loadImages() {
        this.normalGhost = new Image();
        this.normalGhost.src = "image1/ghost.png";
    
        // Blue
        this.scaredGhost = new Image();
        this.scaredGhost.src = "image1/scaredGhost.png";
    
        // White
        this.scaredGhost2 = new Image();
        this.scaredGhost2.src = "image1/scaredGhost2.png";
    
        this.image = this.normalGhost; // red
      }
}