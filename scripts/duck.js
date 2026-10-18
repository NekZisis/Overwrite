const duckBtn = document.getElementById('duck-btn');
const duckBackground = document.getElementById('duck-background');
const quackSound = new Audio('./sounds/duck-quack.mp3');

const fpsText = document.getElementById('fps-text');
const fpsDisplay = document.getElementById('fps-display');

duckBtn.addEventListener('click', () => {
    duckBackground.hidden = !duckBackground.hidden;

    if (fpsText.innerHTML === 'FPS') {
        fpsText.innerHTML = 'server quacks per second';
        fpsText.style.color = 'black';
        fpsDisplay.style.color = 'black';
    } else {
        fpsText.innerHTML = 'FPS';
        fpsText.style.color = 'white';
        fpsDisplay.style.color = 'white';
    }

    quackSound.pause();
    quackSound.currentTime = 0;
    quackSound.play().catch(error => {
        console.error("Audio playback error:", error);
    });
});