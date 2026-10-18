import { Player } from './Player.js';
import { Background } from './Background.js';
import { InputHandler } from './InputHandler.js';
import { createObjects } from './DATA/OBJECTS.js';
import { GAME_SETTINGS } from './DATA/GAME_SETTINGS.js';

export class Game {
    constructor(worldWidth, worldHeight, viewportWidth, viewportHeight) {
        this.width = worldWidth;
        this.height = worldHeight;
        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;
        this.input = new InputHandler();

        // Add camera object starting at 0,0
        this.camera = { x: 0, y: 0 };

        this.objects = createObjects(worldWidth, worldHeight);
        this.player = new Player(this.width, this.height, this.objects);
        this.backgroundRenderer = new Background(this.width, this.height, this.objects);

        this.zoom = GAME_SETTINGS.camera.zoom; 
        if (GAME_SETTINGS.camera.developer) {
            this.zoom = GAME_SETTINGS.camera.developer_zoom;
        }
        this.zoom = GAME_SETTINGS.camera.developer ? 
            GAME_SETTINGS.camera.developer_zoom : 
            GAME_SETTINGS.camera.zoom;


        this.lerp = GAME_SETTINGS.camera.lerp;
        this.cameraPadding = GAME_SETTINGS.camera.padding;

        const cameraTarget = this.getCameraTarget();
        this.camera.x = cameraTarget.targetX;
        this.camera.y = cameraTarget.targetY;
    }

    resize(width, height) {
        this.viewportWidth = width;
        this.viewportHeight = height;
    }

    getCameraTarget() {
        const viewWidth = this.viewportWidth / this.zoom;
        const viewHeight = this.viewportHeight / this.zoom;
        const padding = this.cameraPadding;
        const horizontalOverflow = viewWidth > (this.width + padding * 2);
        const verticalOverflow = viewHeight > this.height + padding * 2;
        const minX = horizontalOverflow ? (this.width - viewWidth) / 2 : -padding;
        const maxX = horizontalOverflow ? minX : this.width - viewWidth + padding;
        const minY = verticalOverflow ? (this.height - viewHeight) / 2 : -padding;
        const maxY = verticalOverflow ? minY : this.height - viewHeight + padding;
        const targetX = Math.max(minX, Math.min(maxX,
            this.player.x + (this.player.width / 2) - (viewWidth / 2)));
        const targetY = Math.max(minY, Math.min(maxY,
            this.player.y + (this.player.height / 2) - (viewHeight / 2)));

        return { minX, maxX, minY, maxY, targetX, targetY };
    }

    update(deltaTime) {
        this.player.update(deltaTime, this.input);

        const { minX, maxX, minY, maxY, targetX, targetY } = this.getCameraTarget();
        const cameraFollowFactor = 1 - Math.pow(1 - this.lerp, deltaTime * 60);

        // apply smooth following (lerp)
        this.camera.x = Math.max(minX, Math.min(maxX,
            this.camera.x + (targetX - this.camera.x) * cameraFollowFactor));
        this.camera.y = Math.max(minY, Math.min(maxY,
            this.camera.y + (targetY - this.camera.y) * cameraFollowFactor));
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

    renderBackgroundViewport(context) {
        context.clearRect(0, 0, this.width, this.height);
        this.backgroundRenderer.drawCameraViewport(
            context,
            Math.floor(this.camera.x),
            Math.floor(this.camera.y),
            this.viewportWidth / this.zoom,
            this.viewportHeight / this.zoom
        );
    }
}