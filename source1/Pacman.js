import MovingDirection from "./MovingDirection.js";

export default class Pacman{
    constructor(x, y, tileSize, velocity, tileMap) {
    // Initialize location, size, speed, map and other properties
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.velocity = velocity;
    this.tileMap = tileMap;
    // Initialize direction control related properties
    this.currentMovingDirection = null; // Current moving direction (initialized to null)
    this.requestedMovingDirection = null; // Requested direction of movement (initialized to null)

    this.pacmanAnimationTimerDefault = 10;
    this.pacmanAnimationTimer = null;

    this.pacmanRotation = this.Rotation.right; //default rotation = right

    this.wakaSound = new Audio("sounds1/waka.wav"); // dot sound

    this.powerDotSound = new Audio("sounds1/power_dot.wav"); //power dot sound
    this.powerDotActive = false; // If the power dot active, ghost become blue
    this.powerDotAboutToExpire = false; // If it's about to expire, ghost flash between white and blue
    this.timers = [];

    this.eatGhostSound = new Audio("sounds1/eat_ghost.wav"); // Eat ghost sound

    this.madeFirstMove = false; // check if player has started or no (by making the first move)

    document.addEventListener("keydown", this.#keydown);


    this.#loadPacmanImages(); // load the three images
    }


    // check the value to rotate Pacman
    Rotation = {
      right: 0,
      down: 1,
      left: 2,
      up: 3,
    };
  
    draw(ctx, pause, enemies){
      if (!pause) {
        this.#move(); // stop pacman's move
        this.#animate(); // stop pacman's animation
      }

        this.#eatDot(); // Eat dot

        this.#eatPowerDot(); // Eat power dot

        this.#eatGhost(enemies); // Eat ghost

        const size = this.tileSize / 2;

        ctx.save();
        ctx.translate(this.x + size, this.y + size); // Move the drawing origin to Pacman's center for proper rotation
        ctx.rotate((this.pacmanRotation * 90 * Math.PI) / 180); // Rotate the canvas based on Pacman's direction

        ctx.drawImage(
          this.pacmanImages[this.pacmanImageIndex],
          -size,
          -size,
          this.tileSize,
          this.tileSize
        );
    
        ctx.restore(); // Rotate everything back 

        // ctx.drawImage(
        //     this.pacmanImages[this.pacmanImageIndex],
        //     this.x,
        //     this.y,
        //     this.tileSize,
        //     this.tileSize
        //   );
    }

    // 0 to 1 to 2 to 1 for the animation loop
    #loadPacmanImages(){
      const pacmanImage1 = new Image();
      pacmanImage1.src = "image1/pac0.png";

      const pacmanImage2 = new Image();
      pacmanImage2.src = "image1/pac1.png";

      const pacmanImage3 = new Image();
      pacmanImage3.src = "image1/pac2.png";

      const pacmanImage4 = new Image();
      pacmanImage4.src = "image1/pac1.png";

      this.pacmanImages = [
        pacmanImage1,
        pacmanImage2,
        pacmanImage3,
        pacmanImage4,
      ];
  
      this.pacmanImageIndex = 0; // we start with image 0
    }

    //keyboard input
    #keydown = (event) => {
        // 38 = up key on our keyboard
        if (event.keyCode == 38) {
            if (this.currentMovingDirection == MovingDirection.down)
              this.currentMovingDirection = MovingDirection.up;
            this.requestedMovingDirection = MovingDirection.up;
            this.madeFirstMove = true;
          }
          // 40 = down key on our keyboard
          if (event.keyCode == 40) {
            if (this.currentMovingDirection == MovingDirection.up) // If the current movement direction is downward and the user presses the up key
              this.currentMovingDirection = MovingDirection.down; // Change the current moving direction to upward
            this.requestedMovingDirection = MovingDirection.down; // Set the requested movement direction to upward
            this.madeFirstMove = true; // Set the first move and then enemies can move
          }
          // 37 = left key on our keyboard
          if (event.keyCode == 37) {
            if (this.currentMovingDirection == MovingDirection.right)
              this.currentMovingDirection = MovingDirection.left;
            this.requestedMovingDirection = MovingDirection.left;
            this.madeFirstMove = true;
          }
          //39 = right key on our keyboard
          if (event.keyCode == 39) {
            if (this.currentMovingDirection == MovingDirection.left)
              this.currentMovingDirection = MovingDirection.right;
            this.requestedMovingDirection = MovingDirection.right;
            this.madeFirstMove = true;
          }
        };
    
    // move Pacman
    #move() {
        if (this.currentMovingDirection !== this.requestedMovingDirection){
            // Check if Pacman is already in a complete grid (i.e. if the x and y coordinates are integer multiples of tileSize)
            if (
                Number.isInteger(this.x / this.tileSize) && // Check if the x coordinate is an integer multiple of tileSize
                Number.isInteger(this.y / this.tileSize)
              ) {
                // check if there is a collision to...
                if (
                    !this.tileMap.didCollideWithEnvironment(
                      this.x, // x direction
                      this.y, // y direction
                      this.requestedMovingDirection // Direction that pacman wants to go
                    )
                  )

                this.currentMovingDirection = this.requestedMovingDirection;
              }
        }
        
        // Prevent collision with walls
        if (
            this.tileMap.didCollideWithEnvironment(
              this.x, // The current x coordinate of Pacman
              this.y, // The current y coordinate of Pacman
              this.currentMovingDirection // Current direction of Pacman's movement
            )
          ) {
            this.pacmanAnimationTimer = null; // If a collision occurs, pause the animation
            this.pacmanImageIndex = 1; // Set the animation frame index to 1 to keep the image of Pacman still(mouth partially open image)
            return;
          }
          // If there is no collision, check if the animation needs to be reactivated
          else if (
            this.currentMovingDirection != null &&
            this.pacmanAnimationTimer == null
          ) {
            this.pacmanAnimationTimer = this.pacmanAnimationTimerDefault; 
          }

        // Move according to the current moving direction
        switch (this.currentMovingDirection) {
            case MovingDirection.up: // If the current direction is up
                this.y -= this.velocity; // Subtract the speed value from Pacman's y coordinate to indicate upward movement
                this.pacmanRotation = this.Rotation.up; // Add rotation to the move
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

    //Controlling Pacman's animations
    #animate() {
      // if the animation timer = null, we don't do anything
      if (this.pacmanAnimationTimer == null) {
        return; // Do not execute any animation logic
      }
      // Decrement animation timer (by 1 each frame)
      this.pacmanAnimationTimer--;
      // When the animation timer reaches 0, update the animation frame
      if (this.pacmanAnimationTimer == 0) {
        this.pacmanAnimationTimer = this.pacmanAnimationTimerDefault;
        // Switch to the next frame image
        this.pacmanImageIndex++;
        if (this.pacmanImageIndex == this.pacmanImages.length)
          this.pacmanImageIndex = 0; // Loop the animation
      }
    }
    // Make dot disapear when it's been eaten
    #eatDot() {
      if (this.tileMap.eatDot(this.x, this.y) && this.madeFirstMove) {
        this.wakaSound.play(); //play sound
      }
    }

    // Make power dot disappear and activate its effect
    #eatPowerDot() {
      // check if the pacman is on the power dot
      if (this.tileMap.eatPowerDot(this.x, this.y)) {
        this.powerDotSound.play(); //power dot sound
        this.powerDotActive = true; // Activate the power dot effect
        this.powerDotAboutToExpire = false; // Reset expiration warning
        this.timers.forEach((timer) => clearTimeout(timer)); // Clear any existing timers
        this.timers = []; // Reset timers array
  
         // Set a timer for 6 seconds after eating the power dot
        let powerDotTimer = setTimeout(() => {
          this.powerDotActive = false; // No deactivate the power dot effect
          this.powerDotAboutToExpire = false; // No reset expiration warning
        }, 1000 * 6);
  
        this.timers.push(powerDotTimer);
  
        // Set a timer for 3 seconds before the effect expires, to remind a warning to player
        let powerDotAboutToExpireTimer = setTimeout(() => {
          this.powerDotAboutToExpire = true; // Activate the expiration warning
        }, 1000 * 3);
  
        this.timers.push(powerDotAboutToExpireTimer); // Add the timer to the list of timers
      }
    }

    // Eat ghost 
    #eatGhost(enemies) {
      if (this.powerDotActive) {
        // Filter out the enemies that are colliding with Pacman
        const collideEnemies = enemies.filter((enemy) => enemy.collideWith(this));
        // Remove the enemy from the enemies array
        collideEnemies.forEach((enemy) => {
          enemies.splice(enemies.indexOf(enemy), 1); // remove 1 item
          this.eatGhostSound.play(); // play the eat ghost sound after remove the enemy
        });
      }
    }
}