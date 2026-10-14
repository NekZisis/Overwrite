const settings = document.getElementById('settings-menu');
const duckBtn = document.getElementById('duck-btn');
const duckBackground = document.getElementById('duck-background');
let settingFlag = false;

window.addEventListener('keydown', (e)=> {
    if (e.key === 'Escape') {
        openSettings();
    }
});

duckBtn.addEventListener('click', () => {
    duckBackground.hidden = !duckBackground.hidden;
});

export function openSettings() {
    const isOpening = !settingFlag;
    settingFlag = isOpening;
    settings.style.display = isOpening ? 'flex' : 'none';

    const eventName = isOpening ? 'game:pause' : 'game:resume';
    const pauseEvent = new CustomEvent(eventName, {
        detail: { reason: isOpening ? 'settings_opened' : 'settings_closed' }
    });

    window.dispatchEvent(pauseEvent);
}