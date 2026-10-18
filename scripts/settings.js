const settings = document.getElementById('settings-menu');
let settingFlag = false;

window.addEventListener('keydown', (e)=> {
    if (e.key === 'Escape') {
        openSettings();
    }
});

export function openSettings() {
    setSettingsOpen(!settingFlag);
}

export function setSettingsOpen(isOpen) {
    if (settingFlag === isOpen) return;

    settingFlag = isOpen;
    settings.style.display = isOpen ? 'flex' : 'none';
    document.body.classList.toggle('settings-open', isOpen);

    const eventName = isOpen ? 'game:pause' : 'game:resume';
    const pauseEvent = new CustomEvent(eventName, {
        detail: { reason: isOpen ? 'settings_opened' : 'settings_closed' }
    });

    window.dispatchEvent(pauseEvent);
}
