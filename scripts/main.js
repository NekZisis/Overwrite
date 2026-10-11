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

const fixedTimeStep = 1 / 60;
const maxFrameTime = 0.1;
let accumulator = 0;
let lastTime = null;
let windowFocused = document.hasFocus();
let gameActive = windowFocused && document.visibilityState === 'visible';

function updateGameActivity() {
    const active = windowFocused && document.visibilityState === 'visible';

    if (active === gameActive) return;

    gameActive = active;
    accumulator = 0;
    lastTime = null;

    if (!gameActive) {
        game.input.clear();
    }
}

window.addEventListener('blur', () => {
    windowFocused = false;
    updateGameActivity();
});

window.addEventListener('focus', () => {
    windowFocused = true;
    updateGameActivity();
});

document.addEventListener('visibilitychange', updateGameActivity);

function gameLoop(timeStamp) {
    if (lastTime === null) lastTime = timeStamp;
    const elapsed = Math.min((timeStamp - lastTime) / 1000, maxFrameTime);
    lastTime = timeStamp;

    if (gameActive) {
        accumulator += elapsed;
        while (accumulator >= fixedTimeStep) {
            game.update(fixedTimeStep);
            accumulator -= fixedTimeStep;
        }
    } else {
        accumulator = 0;
    }

    game.renderBackground(bgCTX);
    game.render(gameCTX);
    requestAnimationFrame(gameLoop);
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
    requestAnimationFrame(gameLoop);
}