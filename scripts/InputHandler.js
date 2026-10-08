export class InputHandler {
    constructor() {
        this.keys = new Set();

        // KEYBOARD

        window.addEventListener('keydown', (e) => {
        // Prevent browser viewport scrolling on navigation keys
            if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }
            this.keys.add(e.code);
        });

        window.addEventListener('keyup', (e) => {
        this.keys.delete(e.code);
        });

    }

    isPressed(code) {
        return this.keys.has(code);
    }
}