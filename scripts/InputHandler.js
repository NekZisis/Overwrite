export class InputHandler {
    constructor() {
        this.keys = new Set();
        this.isLocked = false; 

        // KEYBOARD

        window.addEventListener('keydown', (e) => {
            if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }
            this.keys.add(e.code);
        });

        window.addEventListener('keyup', (e) => {
            this.keys.delete(e.code);
        });

        // Clear held keys when tab or window loses focus.
        window.addEventListener('blur', () => this.clear());

    }

    dash(actionCallback) {
        if (this.isLocked) return;

        // Track physical key state while withholding it from gameplay.
        this.isLocked = true;

        actionCallback(() => {
            this.isLocked = false;
        });
    }

    isPressed(code) {
        return !this.isLocked && this.keys.has(code);
    }

    clear() {
        this.keys.clear();
    }
}