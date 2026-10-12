const duckBtn = document.getElementById('duck-btn');
const duckBackground = document.getElementById('duck-background');

duckBtn.addEventListener('click', () => {
    duckBackground.hidden = !duckBackground.hidden;
});
