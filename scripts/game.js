import { Player } from './Player.js';
import { Background } from './Background.js';
import { InputHandler } from './InputHandler.js';

export class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.viewportWidth = width;
        this.viewportHeight = height;
        this.input = new InputHandler();

        // Add camera object starting at 0,0
        this.camera = { x: 0, y: 0 };

        this.objects = this.createObjects(width, height);
        this.player = new Player(this.width, this.height, this.objects);
        this.background = new Background(this.width, this.height, this.objects);

        this.zoom = 2; //ACTUAL VALUE
        // this.zoom = 0.5; // PROTOTYPING VALUE
        this.lerp = 0.1;
        this.cameraPadding = 100;
    }

    createObjects(width, height) {
        const center = width / 2;
        return [
            [0, 0, 20, height], 
            [width - 20, 0, 20, height], 
            [0, height - 20, width, 20],
            [0, 0, width, 20],
            [center - 325, 750, 650, 20],
            [center - 285, 180, 35, 500],
            [center + 250, 180, 35, 500],
            [center - 475, 100, 50, 900],
            [center + 425, 100, 50, 900],
            [center + 50, 100, 100, 20],
            [center - 150, 204, 100, 20],
            [center + 50, 308, 100, 20],
            [center - 150, 412, 100, 20],
            [center + 50, 516, 100, 20],
            [center - 150, 620, 100, 20],
            [center - 325, height - 200, 100, 20],
            [center + 225, height - 200, 100, 20],
            [200, height - 100, 150, 20], 
            [50, 500, 100, 20],
            [50, height - 190, 100, 20],
            [230, height - 450, 10, 220],
            [230, height - 450, 65, 20], 
            [100, 100, 20, 300],
            [250, 250, 20, 250], 
            [375, 320, 20, 250], 
            [center - 755, 100, 280, 20]
        ];
    }

    resize(width, height) {
        this.viewportWidth = width;
        this.viewportHeight = height;
    }

    update(deltaTime) {
        this.player.update(deltaTime, this.input);

        const viewWidth = this.viewportWidth / this.zoom;
        const viewHeight = this.viewportHeight / this.zoom;
        const padding = this.cameraPadding;
        const horizontalOverflow = viewWidth > this.width + padding * 2;
        const verticalOverflow = viewHeight > this.height + padding * 2;
        const minX = horizontalOverflow ? (this.width - viewWidth) / 2 : -padding;
        const maxX = horizontalOverflow ? minX : this.width - viewWidth + padding;
        const minY = verticalOverflow ? (this.height - viewHeight) / 2 : -padding;
        const maxY = verticalOverflow ? minY : this.height - viewHeight + padding;
        const targetX = Math.max(minX, Math.min(maxX,
            this.player.x + (this.player.width / 2) - (viewWidth / 2)));
        const targetY = Math.max(minY, Math.min(maxY,
            this.player.y + (this.player.height / 2) - (viewHeight / 2)));

        // apply smooth following (lerp)
        this.camera.x = Math.max(minX, Math.min(maxX,
            this.camera.x + (targetX - this.camera.x) * this.lerp));
        this.camera.y = Math.max(minY, Math.min(maxY,
            this.camera.y + (targetY - this.camera.y) * this.lerp));
    }

    render(ctx) {
        // clear dynamic canvas
        ctx.clearRect(0, 0, this.width, this.height);

        ctx.save();

        ctx.scale(
            this.zoom * this.width / this.viewportWidth,
            this.zoom * this.height / this.viewportHeight
        );
        ctx.translate(-Math.floor(this.camera.x), -Math.floor(this.camera.y));
        // render entities (just the player for now)
        this.player.draw(ctx);
        
        ctx.restore();
    }

    // rendering background only happens once

    renderBackground(ctx) {
        // clear background canvas in screen space
        ctx.clearRect(0, 0, this.width, this.height);

        ctx.save();

        ctx.scale(
            this.zoom * this.width / this.viewportWidth,
            this.zoom * this.height / this.viewportHeight
        );
        // shift background by negative camera coordinates
        ctx.translate(-Math.floor(this.camera.x), -Math.floor(this.camera.y));
        // render the static background 
        this.background.draw(ctx);

        ctx.restore();
    }
}