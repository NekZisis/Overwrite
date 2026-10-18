import { updatePlayerMovement } from "./PlayerMovement.js";
import { PLAYER_SETTINGS } from "./DATA/PLAYER_SETTINGS.js";

export class Player {
    constructor(gameWidth, gameHeight, objects) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.objects = objects;


        // FROM PLAYER SETTINGS
        this.width = PLAYER_SETTINGS.width;
        this.height = PLAYER_SETTINGS.height;
        this.speed = PLAYER_SETTINGS.speed;
        this.airSpeed = PLAYER_SETTINGS.airSpeed;
        this.groundAcceleration = PLAYER_SETTINGS.groundAcceleration;
        this.groundDeceleration = PLAYER_SETTINGS.groundDeceleration;
        this.airDeceleration = PLAYER_SETTINGS.airDeceleration;
        this.gravity = PLAYER_SETTINGS.gravity;
        this.jumpForce = PLAYER_SETTINGS.jumpForce;
        this.downForce = PLAYER_SETTINGS.downForce;
        this.dashSpeed = PLAYER_SETTINGS.dashSpeed;
        this.maxFallSpeed = PLAYER_SETTINGS.maxFallSpeed;

        // spawn position (bottom-center)
        this.x = this.gameWidth / 2 - this.width / 2;
        this.y = this.gameHeight - this.height - 20;

        // velocity vectors (px/s)
        this.vx = 0;
        this.vy = 0;

        // logical states (for the player)
        this.facing = "right";
        this.isOnGround = false;
        this.dashing = false;
        this.dashUnlock = null;
        this.dashDirection = 1;
        this.latched = false; 
        this.toggleGravity = true;
        this.wallLatched = null;

        // Timers
        this.dashTimer = 0;
        this.dashCooldown = 0;

        // Coyote Time
        this.coyoteTime = 0.05; // 50 ms
        this.coyoteTimer = 0;
    }

    update(deltaTime, input) {
        updatePlayerMovement(this, deltaTime, input);
    }

    checkForCollision(x, y) {
        const playerRight = x + this.width;
        const playerBottom = y + this.height;
        const collisions = [];

        for (const object of this.objects) {
            const overlaps =
                (x < object.x + object.width) &&
                (playerRight > object.x) &&
                (y < object.y + object.height) &&
                (playerBottom > object.y);

            if (overlaps) {
                collisions.push(object);
            }
        }

        return collisions;
    }

    // draw player model at current position (white rectangle for now)
    draw(ctx) {
        // Draw player model
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}