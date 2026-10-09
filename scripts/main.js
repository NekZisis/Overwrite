import { Game } from './game.js';

const virtual_width = 1920;
const virtual_height = 1080;

// static/background (bg) canvas
const bgCanvas = document.getElementById('bgCanvas');
const bgCTX = bgCanvas.getContext('2d');
bgCanvas.width = virtual_width;
bgCanvas.height = virtual_height;

// dynamic canvas
const gameCanvas = document.getElementById('gameCanvas');
const gameCTX = gameCanvas.getContext('2d');
gameCanvas.width = virtual_width;
gameCanvas.height = virtual_height;

// initiate game
const game = new Game(gameCanvas.width, gameCanvas.height);
// render background once
game.renderBackground(bgCTX);

let lastTime = 0; // initialize the deltaTime calculator
function gameLoop(timeStamp) {
    if (!lastTime) lastTime = timeStamp;

    let deltaTime = (timeStamp - lastTime) / 1000;
    deltaTime = Math.min(deltaTime, 0.1);

    lastTime = timeStamp;

    // game loop
    game.update(deltaTime); // update dynamic state
    game.render(gameCTX);  // render the new frame
    requestAnimationFrame(gameLoop); // continue
}

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        lastTime = performance.now();
    }
});

// block out all mobile users
function isMobileDevice() {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth < 768;
    return hasTouch && isSmallScreen;
}
if (isMobileDevice()) {
    document.getElementById('mobile-blocker').style.display = 'flex';
} else {
    // starts game loop if not a mobile user
    requestAnimationFrame(gameLoop);
}
