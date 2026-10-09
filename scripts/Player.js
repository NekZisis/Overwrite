export class Player {
    constructor(gameWidth, gameHeight, objects) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.objects = objects;

        // player dimensions (hitbox)
        this.width = 20;
        this.height = 40;

        // spawn position (bottom-center for now)
        this.x = this.gameWidth / 2 - this.width / 2;
        this.y = this.gameHeight - this.height - 40;

        // velocity vectors (px/s)
        this.vx = 0;
        this.vy = 0;

        // physics and control constants
        this.speed = 350;        // horizontal movement speed (px/s)
        this.jumpForce = -550;   // upward jump speed (px/s)
        this.downForce = 400;   //  downward movement speed (px/s)
        this.gravity = 1500;     // acceleration due to gravity (px/s^2)
        this.isOnGround = false;
        this.facing = "right";
    }

    update(deltaTime, input) {
        // Horizontal Input Handling
        const leftPressed = input.isPressed('KeyA');
        const rightPressed = input.isPressed('KeyD');

        if (leftPressed && !rightPressed) {
          this.vx = -this.speed;
          this.facing = "left";
        } else if (rightPressed && !leftPressed) {
          this.vx = this.speed;
          this.facing = "right";
        } else {
          this.vx = 0;
        }

        // Vertical / Jump Input Handling
        const jumpPressed = input.isPressed('KeyW');

        if (jumpPressed && this.isOnGround) {
          this.vy = this.jumpForce;
          this.isOnGround = false;
        }

        // Vertical / Downwards Input Handling
        const downPressed = input.isPressed('KeyS');

        if (downPressed && !this.isOnGround) {
            this.vy = this.downForce;
        }

        // Physics Integration
        this.vy += this.gravity * deltaTime;
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;

        // Horizontal Screen Boundaries
        if (this.x < 20) this.x = 20;
        if (this.x + this.width > this.gameWidth - 20) {
          this.x = this.gameWidth - this.width - 20;
        }

        // Dash 
        const spacePressed = input.isPressed('Space');

        if (spacePressed) {
            // implement dash
        }

        // Floor Collision & Ground Snap
        const floorLevel = this.gameHeight - 20;

        if (this.y + this.height >= floorLevel) {
          this.y = floorLevel - this.height;
          this.vy = 0;
          this.isOnGround = true;
        }
        

    }

    enableCollisions() {
      
    }

    // draw player model at current position (white rectangle for now)
    draw(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}