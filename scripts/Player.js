export class Player {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;

    // Dimensions
    this.width = 30;
    this.height = 50;

    // Spawn position (e.g. bottom-center)
    this.x = this.gameWidth / 2 - this.width / 2;
    this.y = this.gameHeight - this.height - 100; // 100px above bottom floor for testing fall

    // Velocity vectors (pixels per second)
    this.vx = 0;
    this.vy = 0;

    // Physics constants
    this.gravity = 1500; // pixels / second^2
  }

  update(deltaTime) {
    // Apply gravity to vertical velocity
    this.vy += this.gravity * deltaTime;

    // Update positions based on velocity and deltaTime
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;

    // TODO: Temporary ground collision logic here so player doesn't fall into the abyss
    if ((this.y + this.height) >= this.gameHeight) {
        this.y = 50;
        this.vy = 0;
    }
  }

  draw(ctx) {
    // Render player bounding box
    ctx.fillStyle = 'white';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}