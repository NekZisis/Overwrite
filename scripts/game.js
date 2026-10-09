import { Player } from './Player.js';
import {Background} from './Background.js';
import { InputHandler } from './InputHandler.js';

export class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.input = new InputHandler();

        const middle = this.width / 2;
        this.objects = [
            [0, 0, 20, height], 
            [width - 20, 0, 20, height], 
            [0, height - 20, width, 20],
            [0, 0, width, 20],
            [middle - 325, 750, 650, 20],
            [middle - 285, 180, 35, 500],
            [middle + 250, 180, 35, 500], 
            [middle - 475, 100, 50, 900],
            [middle + 425, 100, 50, 900], 
            [middle + 50, 100, 100, 20], 
            [middle - 150, 204, 100, 20],
            [middle + 50, 308, 100, 20],
            [middle - 150, 412, 100, 20],
            [middle + 50, 516, 100, 20],
            [middle - 150, 620, 100, 20],
            [middle - 325, height - 200, 100, 20], 
            [middle + 225, height - 200, 100, 20], 
            [200, height - 100, 150, 20], 
            [50, 500, 100, 20],
            [50, height - 190, 100, 20],
            [230, height - 450, 10, 220],
            [230, height - 450, 65, 20], 
            [100, 100, 20, 300],
            [250, 250, 20, 250], 
            [375, 320, 20, 250], 
            [middle - 755, 100, 280, 20]
        ];

        this.player = new Player(this.width, this.height, this.objects);
        this.background = new Background(this.width, this.height, this.objects);
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
        // clear background canvas
        ctx.clearRect(0, 0, this.width, this.height);

        // render the static background 
        this.background.draw(ctx);
    }

    
}