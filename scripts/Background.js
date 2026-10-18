export class Background {
    constructor(worldWidth, worldHeight, objects) {
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.objects = objects;

        this.backgroundCacheCanvas = document.createElement('canvas');
        this.backgroundCacheCanvas.width = worldWidth;
        this.backgroundCacheCanvas.height = worldHeight;

        const backgroundCacheContext = this.backgroundCacheCanvas.getContext('2d');
        if (!backgroundCacheContext) {
            throw new Error('Unable to create the background cache canvas context.');
        }
        this.drawWorldToCache(backgroundCacheContext);
    }

    drawWorldToCache(context) {
        context.fillStyle = '#414141';

        this.objects.forEach((platform) => {
            if (platform.material === 'stone') {
                context.fillRect(platform.x, platform.y, platform.width, platform.height);
            } else {
                context.fillStyle = "#081d05";
                context.fillRect(platform.x, platform.y, platform.width, platform.height);
                context.fillStyle = '#414141';
            }
        });
    }

    drawCameraViewport(context, cameraX, cameraY, viewportWidth, viewportHeight) {
        context.drawImage(
            this.backgroundCacheCanvas,
            cameraX,
            cameraY,
            viewportWidth,
            viewportHeight,
            0,
            0,
            context.canvas.width,
            context.canvas.height
        );
    }
}