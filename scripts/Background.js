export class Background {
    constructor(bgWidth, bgHeight) {
        this.bgWidth = bgWidth;
        this.bgHeight = bgHeight;
    }

    draw(ctx) {
        ctx.fillStyle = 'black';
        ctx.fillRect(100, 100, 100, 100);
    }
}