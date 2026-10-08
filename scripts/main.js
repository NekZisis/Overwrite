import { Game } from './Game.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const game = new Game(1980, 1024);

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);


function render() {

}


let lastTime = 0;

function gameLoop(timeStamp) {
    
    const deltaTime = (timeStamp - lastTime) / 1000;
    lastTime = timeStamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Update physics/positions (passing deltaTime)
  
    render(); 

    requestAnimationFrame(gameLoop);
}

function isMobileDevice() {
    // Checks for touch capabilities and screen size, meaning phone device
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth < 768;
    return hasTouch && isSmallScreen;
}

if (isMobileDevice()) {
    document.getElementById('mobile-blocker').style.display = 'flex';
} else {

    requestAnimationFrame(gameLoop);
}
