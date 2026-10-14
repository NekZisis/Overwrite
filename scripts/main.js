import { Game } from './game.js';

// Fixed world size. Will be changed depending how big I'm planning to make each world. 
const worldWidth = 1920;
const worldHeight = 1080;

// NOTICE: The background stays static. Only the viewport changes during gameplay.

// Background (#bgCanvas) canvas. ITS STATIC.
const bgCanvas = document.getElementById('bgCanvas');
const bgCTX = bgCanvas.getContext('2d');
bgCanvas.width = worldWidth;
bgCanvas.height = worldHeight;

// Dynamic canvas (#gameCanvas). IT CHANGES WITH EVERY FRAME.
const gameCanvas = document.getElementById('gameCanvas');
const gameCTX = gameCanvas.getContext('2d');
gameCanvas.width = worldWidth;
gameCanvas.height = worldHeight;

// Start the game
const game = new Game(worldWidth, worldHeight, window.innerWidth, window.innerHeight);

// Resizing the window also resizes the user's viewport. 
// Notice: Larger screens get more viewport.
window.addEventListener('resize', () => {
    game.resize(window.innerWidth, window.innerHeight);
});

const maxFrameTime = 0.1;
let lastTime = null;
let fpsFrameCount = 0;
let fpsWindowStart = null;

// States that affect game activity
let windowFocused = document.hasFocus();
let isSettingsOpen = false; 
// Game is only active if focused, visible, and settings are closed
let gameActive = windowFocused && (document.visibilityState === 'visible') && !isSettingsOpen;

function updateGameActivity() {
    // re-evaluating states
    const active = windowFocused && document.visibilityState === 'visible' && !isSettingsOpen;

    if (active === gameActive) return;

    gameActive = active;
    lastTime = null;

    if (!gameActive) {
        game.input.clear();
    }
}

// Window focus/blur listeners
window.addEventListener('blur', () => {
    windowFocused = false;
    updateGameActivity();
});

window.addEventListener('focus', () => {
    windowFocused = true;
    updateGameActivity();
});

document.addEventListener('visibilitychange', updateGameActivity);

// Custom Event Listeners for Settings
window.addEventListener('game:pause', () => {
    isSettingsOpen = true;
    updateGameActivity();
});

window.addEventListener('game:resume', () => {
    isSettingsOpen = false;
    updateGameActivity();
});

function gameLoop(timeStamp) {
    if (lastTime === null) lastTime = timeStamp;
    const elapsed = Math.min((timeStamp - lastTime) / 1000, maxFrameTime);
    lastTime = timeStamp;

    if (gameActive) {
        game.update(elapsed);

        if (fpsWindowStart === null) fpsWindowStart = timeStamp;
        fpsFrameCount++;

        const fpsWindowDuration = timeStamp - fpsWindowStart;
        if (fpsWindowDuration >= 1000) {
            console.log(`FPS: ${Math.round(fpsFrameCount * 1000 / fpsWindowDuration)}`);
            fpsFrameCount = 0;
            fpsWindowStart = timeStamp;
        }
    } else {
        fpsFrameCount = 0;
        fpsWindowStart = null;
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