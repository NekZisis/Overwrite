import { Game } from './game.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 1980;
canvas.height = 1024;

const game = new Game(canvas.width, canvas.height);

let lastTime = 0;

function gameLoop(timeStamp) {
    const deltaTime = (timeStamp - lastTime) / 1000;
    lastTime = timeStamp;

    // 1. Update physics & logical state
    game.update(deltaTime);

    // 2. Render frame
    game.render(ctx);

    requestAnimationFrame(gameLoop);
}

function isMobileDevice() {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth < 768;
    return hasTouch && isSmallScreen;
}

if (isMobileDevice()) {
    document.getElementById('mobile-blocker').style.display = 'flex';
} else {
    requestAnimationFrame(gameLoop);
}
