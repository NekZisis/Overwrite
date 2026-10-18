import { Game } from './game.js';
import { GAME_SETTINGS } from './DATA/GAME_SETTINGS.js'
import { setSettingsOpen } from './settings.js';

function main() {
    const worldWidth = GAME_SETTINGS.world.width;
    const worldHeight = GAME_SETTINGS.world.height;
    const backgroundCanvas = document.getElementById('backgroundCanvas');
    const backgroundContext = backgroundCanvas.getContext('2d');
    const gameCanvas = document.getElementById('gameCanvas');
    const gameCTX = gameCanvas.getContext('2d');
    const game = new Game(worldWidth, worldHeight, window.innerWidth, window.innerHeight);
    const fpsDisplay = document.getElementById('fps-display');

    backgroundCanvas.width = worldWidth;
    backgroundCanvas.height = worldHeight;
    gameCanvas.width = worldWidth;
    gameCanvas.height = worldHeight;

    const maxFrameTime = 0.1;
    let lastTime = null;
    let fpsFrameCount = 0;
    let fpsWindowStart = null;

    let windowFocused = document.hasFocus();
    let isSettingsOpen = false; 
    // Game is only active if focused, visible, and settings are closed
    let gameActive = windowFocused && (document.visibilityState === 'visible') && !isSettingsOpen;

    function updateGameActivity() {
        const active = windowFocused && document.visibilityState === 'visible' && !isSettingsOpen;

        if (active === gameActive) return;

        gameActive = active;
        lastTime = null;

        if (!gameActive) {
            game.input.clear();
            setSettingsOpen(true);
        }
    }

    document.addEventListener('visibilitychange', updateGameActivity);

    window.addEventListener('resize', () => {
        game.resize(window.innerWidth, window.innerHeight);
    });
    
    window.addEventListener('blur', () => {
        windowFocused = false;
        updateGameActivity();
    });

    window.addEventListener('focus', () => {
        windowFocused = true;
        updateGameActivity();
    });

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
                fpsDisplay.innerHTML = `${Math.round(fpsFrameCount * 1000 / fpsWindowDuration)}`;
                fpsFrameCount = 0;
                fpsWindowStart = timeStamp;
            }
        } else {
            fpsFrameCount = 0;
            fpsWindowStart = null;
        }

        game.renderBackgroundViewport(backgroundContext);
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
}

main();