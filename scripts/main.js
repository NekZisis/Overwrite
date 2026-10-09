import { Game } from './Game.js';

// static/background (bg) canvas
const bgCanvas = document.getElementById('bgCanvas');
const bgCTX = bgCanvas.getContext('2d');
bgCanvas.width = 1980;
bgCanvas.height = 1024;

// dynamic canvas
const gameCanvas = document.getElementById('gameCanvas');
const gameCTX = gameCanvas.getContext('2d');
gameCanvas.width = 1980;
gameCanvas.height = 1024;

// Initiate game
const game = new Game(gameCanvas.width, gameCanvas.height);
// render background once
game.renderBackground(bgCTX);

let lastTime = 0; // initialize the deltaTime calculator
function gameLoop(timeStamp) {
    const deltaTime = (timeStamp - lastTime) / 1000;
    lastTime = timeStamp;

    // game loop
    game.update(deltaTime); // update state
    game.render(gameCTX);  // render the new frame
    requestAnimationFrame(gameLoop); // continue
}

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
