import { Player } from './Player.js';

export class Game {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.player = new Player(this.width, this.height);
  }

  update(deltaTime) {
    this.player.update(deltaTime);
  }

  render(ctx) {
    // Clear dynamic foreground canvas
    ctx.clearRect(0, 0, this.width, this.height);

    // Render entities
    this.player.draw(ctx);
  }
}