import { Player } from './Player.js';
import {Background} from './Background.js';
import { InputHandler } from './InputHandler.js';

export class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.input = new InputHandler();
        this.player = new Player(this.width, this.height);
        this.background = new Background(this.width, this.height);
    }

    update(deltaTime) {
        this.player.update(deltaTime, this.input);
    }

    render(ctx) {
        // clear dynamic canvas
        ctx.clearRect(0, 0, this.width, this.height);

        // render entities (just the player for now)
        this.player.draw(ctx);
    }

    renderBackground(ctx) {
        ctx.clearRect(0, 0, this.width, this.height);

        // render all background 
        this.background.draw(ctx);
    }
}