export class Player {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        // player dimensions (hitbox)
        this.width = 30;
        this.height = 50;

        // spawn position (bottom-center for now)
        this.x = this.gameWidth / 2 - this.width / 2;
        this.y = this.gameHeight - this.height - 40;

        // velocity vectors (px/s)
        this.vx = 0;
        this.vy = 0;

        // physics and control constants
        this.speed = 700;        // horizontal movement speed (px/s)
        this.jumpForce = -750;   // upward jump speed (px/s)
        this.downForce = 650;   //  downward movement speed (px/s)
        this.gravity = 1500;     // acceleration due to gravity (px/s^2)
        this.isOnGround = true;
        this.facing = "right";
    }

    update(deltaTime, input) {
        // 1. Horizontal Input Handling
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

        // 2. Vertical / Jump Input Handling
        const jumpPressed = input.isPressed('KeyW');

        if (jumpPressed && this.isOnGround) {
          this.vy = this.jumpForce;
          this.isOnGround = false;
        }

        // 2.5 Vertical / Downwards Input Handling
        const downPressed = input.isPressed('KeyS');

        if (downPressed && !this.isOnGround) {
            this.vy = this.downForce;
        }

        // 3. Physics Integration
        this.vy += this.gravity * deltaTime;
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;

        // 4. Horizontal Screen Boundaries
        if (this.x < 40) this.x = 40;
        if (this.x + this.width > this.gameWidth - 40) {
          this.x = this.gameWidth - this.width - 40;
        }

        // 5. Floor Collision & Ground Snap
        const floorLevel = this.gameHeight - 40;

        if (this.y + this.height >= floorLevel) {
          this.y = floorLevel - this.height;
          this.vy = 0;
          this.isOnGround = true;
        }

        //6. Dash 
        const spacePressed = input.isPressed('Space');

        if (spacePressed) {
            // implement dash
        }
    }

    draw(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}