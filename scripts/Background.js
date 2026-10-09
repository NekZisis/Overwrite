export class Background {
    constructor(bgWidth, bgHeight) {
        this.bgWidth = bgWidth;
        this.bgHeight = bgHeight;
        this.floorLevel = 40;
    }

    draw(ctx) {
        const width = this.bgWidth;
        const height = this.bgHeight;  

        // WALLS
        ctx.fillStyle = '#414141';
        // wall thickness (px)
        const mg = 20; 
        // floor
        ctx.fillRect(0, height - mg, width, mg);
        // ceiling
        ctx.fillRect(0, 0, width, mg);
        // left wall
        ctx.fillRect(0, 0, mg, height);
        // right wall
        ctx.fillRect(width - mg, 0, mg, height);

        // PLATFORMS
        // [x, y, width, height]
        const middle = width/2;
        const platforms = [

            // MIDDLE SECTION

            // large middle platform
            [middle - 325, 750, 650, 20],
            // thin middle columns
            [middle - 285, 180, 35, 500], // left
            [middle + 250, 180, 35, 500], // right 
            // wide middle columns
            [middle - 475, 100, 50, 900], // left
            [middle + 425, 100, 50, 900], // right
            // center platforms 
            [middle + 50, 100, 100, 20], // top to bottom
            [middle - 150, 204, 100, 20],
            [middle + 50, 308, 100, 20],
            [middle - 150, 412, 100, 20],
            [middle + 50, 516, 100, 20],
            [middle - 150, 620, 100, 20],
            // bottom platforms
            [middle-325, height-200, 100, 20], // left
            [middle+225, height-200, 100, 20], // right

            // LEFT SECTION

            // bottom left platform
            [200, height - 100, 150, 20], // left
            // two most-left small platforms
            [50, 500, 100, 20], // top
            [50, height - 190, 100, 20], // bottom
            // left Γ platform
            [230, height - 450, 10, 220], // vertical (|)
            [230, height - 450, 65, 20], // horizontal (-) 
            // three left thin columns
            [100, 100, 20, 300], // left-highest
            [250, 250, 20, 250], // middle-middle 
            [375, 320, 20, 250], // right-lowest
            // connector to mid
            [middle - 755, 100, 280, 20]
        ];

        platforms.forEach((platform) => {
            ctx.fillRect(platform[0], platform[1], platform[2], platform[3]);
        })

    }
}