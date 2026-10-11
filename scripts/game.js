import { Player } from './Player.js';
import { Background } from './Background.js';
import { InputHandler } from './InputHandler.js';

export class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.input = new InputHandler();

        // Add camera object starting at 0,0
        this.camera = { x: 0, y: 0 };

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
        this.zoom = 1.0;
    }

    update(deltaTime) {
        this.player.update(deltaTime, this.input);

        const viewWidth = this.width / this.zoom;
        const viewHeight = this.height / this.zoom;
        // center the camera  
        const targetX = this.player.x + (this.player.width / 2) - (viewWidth / 2);
        const targetY = this.player.y + (this.player.height / 2) - (viewHeight / 2);        

        // Apply smooth following (lerp)
        this.camera.x += (targetX - this.camera.x) * 0.1;
        this.camera.y += (targetY - this.camera.y) * 0.1;
    }

    render(ctx) {
        // clear dynamic canvas in screen space
        ctx.clearRect(0, 0, this.width, this.height);

        ctx.save();
        ctx.scale(this.zoom, this.zoom); // zoom in
        ctx.translate(-Math.floor(this.camera.x), -Math.floor(this.camera.y));
        
        // render entities (just the player for now)
        this.player.draw(ctx);
        
        ctx.restore();
    }

    renderBackground(ctx) {
        // clear background canvas in screen space
        ctx.clearRect(0, 0, this.width, this.height);

        ctx.save();
        
        // ADD THIS LINE: Apply the exact same zoom to the background
        ctx.scale(this.zoom, this.zoom); 
        
        // Shift context by negative camera coordinates
        ctx.translate(-Math.floor(this.camera.x), -Math.floor(this.camera.y));
        
        // render the static background 
        this.background.draw(ctx);
        
        ctx.restore();
    }
}