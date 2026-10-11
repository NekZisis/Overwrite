export class InputHandler {
    constructor() {
        this.keys = new Set();
        this.isLocked = false; 

        // KEYBOARD

        window.addEventListener('keydown', (e) => {
            if (this.isLocked) return;

        // Prevent browser viewport scrolling on navigation keys
            if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }
            this.keys.add(e.code);
        });

        window.addEventListener('keyup', (e) => {
            if (this.isLocked) return;
            this.keys.delete(e.code);
        });

        // Clear held keys when tab or window loses focus.
        window.addEventListener('blur', () => this.clear());

    }

    dash(actionCallback) {
        if (this.isLocked) return;

        // lock inputs and clear active key states
        this.isLocked = true;
        this.keys.clear();

        // Perform the single action
        actionCallback(() => {
            // Callback function to unlock when the action finishes
            this.isLocked = false;
        });
    }

    isPressed(code) {
        return this.keys.has(code);
    }

    clear() {
        this.keys.clear();
    }
}