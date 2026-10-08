export class Player {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;

    // Dimensions
    this.width = 30;
    this.height = 50;

    // Spawn position
    this.x = this.gameWidth / 2 - this.width / 2;
    this.y = this.gameHeight - this.height;

    // Velocity vectors (pixels per second)
    this.vx = 0;
    this.vy = 0;

    // Physics & Control constants
    this.speed = 700;        // Horizontal movement speed (px/s)
    this.jumpForce = -750;   // Upward jump impulse (px/s)
    this.downForce = 650;   // Downward dash (px/s)
    this.gravity = 1500;     // Acceleration due to gravity (px/s^2)
    this.isOnGround = false;
    this.isOnAir = !this.isOnGround;
  }

  update(deltaTime, input) {
    // 1. Horizontal Input Handling
    const leftPressed = input.isPressed('KeyA');
    const rightPressed = input.isPressed('KeyD');

    if (leftPressed && !rightPressed) {
      this.vx = -this.speed;
    } else if (rightPressed && !leftPressed) {
      this.vx = this.speed;
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
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > this.gameWidth) {
      this.x = this.gameWidth - this.width;
    }

    // 5. Floor Collision & Ground Snap
    const floorLevel = this.gameHeight;
    if (this.y + this.height >= floorLevel) {
      this.y = floorLevel - this.height;
      this.vy = 0;
      this.isOnGround = true;
    }

    //6. Dash 
    const spacePressed = input.isPressed('Space')
  }

  draw(ctx) {
    ctx.fillStyle = 'white';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}