export class Background {
    constructor(bgWidth, bgHeight) {
        this.bgWidth = bgWidth;
        this.bgHeight = bgHeight;
        this.floorLevel = 40;
    }

    draw(ctx) {

        // WALLS
        ctx.fillStyle = '#414141';
        // wall thickness (px)
        const mg = 40; 
        // floor
        ctx.fillRect(0, this.bgHeight - mg, this.bgWidth, mg);
        // ceiling
        ctx.fillRect(0, 0, this.bgWidth, mg);
        // left wall
        ctx.fillRect(0, 0, mg, this.bgHeight);
        // right wall
        ctx.fillRect(this.bgWidth - mg, 0, mg, this.bgHeight);

        // PLATFORMS

        const platforms = [
            [100, 100, 100, 100], 
            [200, 200, 200, 200]
        ];

        platforms.forEach((platform) => {
            ctx.fillRect(platform[0], platform[1], platform[2], platform[3]);
        })

    }
}