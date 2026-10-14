const duckBtn = document.getElementById('duck-btn');
const duckBackground = document.getElementById('duck-background');
const quackSound = new Audio('./sounds/duck-quack.mp3');

duckBtn.addEventListener('click', () => {
    duckBackground.hidden = !duckBackground.hidden;
    quackSound.pause();
    quackSound.currentTime = 0;
    quackSound.play();
});