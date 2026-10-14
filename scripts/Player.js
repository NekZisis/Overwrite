export class Player {
    constructor(gameWidth, gameHeight, objects) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.objects = objects;

        // player dimensions (hitbox)
        this.width = 20;
        this.height = 40;

        // spawn position (bottom-center for now)
        this.x = this.gameWidth / 2 - this.width / 2;
        this.y = this.gameHeight - this.height - 20;

        // velocity vectors (px/s)
        this.vx = 0;
        this.vy = 0;

        // velocity value constants (px/s)
        this.speed = 300;        // horizontal movement speed when on ground (px/s)
        this.airSpeed = 150;    // horizontal movement speed when on air
        this.groundDeceleration = 60000; // horizontal stopping acceleration (px/s^2)
        this.airDeceleration = 1000; // horizontal stopping acceleration while airborne without input (px/s^2)
        this.jumpForce = -500;   // upward jump speed (px/s)
        this.downForce = 350;   //  downward movement speed (px/s)
        this.gravity = 1600;     // acceleration due to gravity (px/s^2)
        this.maxFallSpeed = 800;
        this.dashSpeed = 600;   // dashing speed (px/s for 0.2s)

        // state variables
        this.facing = "right";
        this.isOnGround = false;
        this.dashing = false;
        this.dashTimer = 0;
        this.dashCooldown = 0;
        this.dashUnlock = null;
        this.dashDirection = 1;
        this.latched = false; 
        this.toggleGravity = true;
        this.wallLatched = null;

        // coyote time settings
        this.coyoteTime = 0.05; // 50 ms
        this.coyoteTimer = 0;
    }

    update(deltaTime, input) {
        const wasOnGround = this.isOnGround;
        let dashEnded = false;

        if (this.dashing) {
            this.dashTimer -= deltaTime;

            if (this.dashTimer <= 1e-9) {
                this.dashing = false;
                dashEnded = true;
                this.dashTimer = 0;
                this.dashCooldown = 0.5;
                this.dashUnlock();
                this.dashUnlock = null;
            }
        } else if (this.dashCooldown > 0) {
            this.dashCooldown = Math.max(0, this.dashCooldown - deltaTime);
            if (this.dashCooldown <= 1e-9) this.dashCooldown = 0;
        }

        if (this.dashing) {
            this.vx = this.dashSpeed * this.dashDirection;
            this.vy = 0;
        }

        // horizontal movement
        const leftPressed = input.isPressed('KeyA');
        const rightPressed = input.isPressed('KeyD');
        let movementDirection = 0;

        if (!this.dashing && leftPressed && !rightPressed) {
            // unlatch from right wall
            if (this.wallLatched === 'right') {
                this.toggleGravity = true;
                this.coyoteTimer = 0.1;
                this.wallLatched = null;
            }
            movementDirection = -1;
            this.facing = "left";

        } else if (!this.dashing && rightPressed && !leftPressed) {
            // unlatch from left wall
            if (this.wallLatched === 'left') {
                this.toggleGravity = true;
                this.coyoteTimer = 0.1;
                this.wallLatched = null;
            }
            movementDirection = 1;
            this.facing = "right";
        } else if (!this.dashing && !rightPressed && !leftPressed) { // 
            const deceleration = (this.isOnGround ? this.groundDeceleration : this.airDeceleration) * deltaTime;
            this.vx = Math.sign(this.vx) * Math.max(0, Math.abs(this.vx) - deceleration);
        } 

        if (movementDirection !== 0) {
            const targetSpeed = !this.isOnGround && this.vy > 0 ? this.airSpeed : this.speed;

            // Preserve higher momentum in the chosen direction; otherwise switch to target speed immediately.
            if (this.vx * movementDirection < targetSpeed) {
                this.vx = movementDirection * targetSpeed;
            }
        }

        // Jump
        const jumpPressed = input.isPressed('KeyW');
        if (this.dashing) {
            this.coyoteTimer = Math.max(0, this.coyoteTimer - deltaTime);
        } else {
            if (this.isOnGround) {
                this.coyoteTimer = this.coyoteTime;
            } else {
                this.coyoteTimer = Math.max(0, this.coyoteTimer - deltaTime);
            }

            if (jumpPressed && this.coyoteTimer > 0) {

                this.vy = this.jumpForce;
                this.isOnGround = false;
                this.coyoteTimer = 0;
            }

            if (jumpPressed && this.wallLatched && (rightPressed !== leftPressed)) {
                this.toggleGravity = true;
                this.coyoteTime = 0.05; // reset coyote time
                this.wallLatched = false;

                this.vy = this.jumpForce;
                this.isOnGround = false;
                this.coyoteTimer = 0;
            }
        }

        // Down Dash
        const downPressed = input.isPressed('KeyS');
        if (!this.dashing && downPressed && !this.isOnGround && !this.wallLatched) {
            if (this.downForce > this.vy) this.vy = this.downForce;
        }

        // Horizontal movement and collision resolution
        const nextX = this.x + this.vx * deltaTime;
        const horizontalCollisions = this.checkForCollision(nextX, this.y);

        if (horizontalCollisions.length === 0) {
            this.x = nextX;
        } else if (this.vx > 0) {
            let nearestLeftEdge = horizontalCollisions[0][0];
            let wallType;

            for (const collision of horizontalCollisions) {
                const objectX = collision[0];
                wallType = collision[4];

                if (objectX < nearestLeftEdge) {
                    nearestLeftEdge = objectX;
                    wallType = collision[4]; 
                }
            }

            this.x = nearestLeftEdge - this.width;
            this.vx = 0;

            // latching on a right wall

            if (wallType === 'vines') {
                this.wallLatched = 'right';
                this.toggleGravity = false;
                this.vy = 0;
                this.isOnGround = true;
            } else if (wallType === 'stone') {

            }


        } else if (this.vx < 0) {
            const firstCollision = horizontalCollisions[0];
            let nearestRightEdge = firstCollision[0] + firstCollision[2];
            let wallType;

            for (const collision of horizontalCollisions) {
                const objectRightEdge = collision[0] + collision[2];
                wallType = collision[4];

                if (objectRightEdge > nearestRightEdge) {
                    nearestRightEdge = objectRightEdge;
                    wallType = collision[4];
                }
            }

            this.x = nearestRightEdge;
            this.vx = 0;

            // latching on a left wall

            if (wallType === 'vines') {
                this.wallLatched = 'left';
                this.toggleGravity = false;
                this.vy = 0;
                this.isOnGround = true;
            }

        }

        // Vertical movement and collision resolution
        if (this.dashing) {
            this.vy = 0;
        } else {
            this.isOnGround = false;
            if (this.toggleGravity) this.vy += this.gravity * deltaTime;
            this.vy = Math.min(this.vy, this.maxFallSpeed);
            const nextY = this.y + this.vy * deltaTime;
            const verticalCollisions = this.checkForCollision(this.x, nextY);

            if (verticalCollisions.length === 0) {
                this.y = nextY;
            } else if (this.vy > 0) {
                let nearestTopEdge = verticalCollisions[0][1];

                for (const collision of verticalCollisions) {
                    const objectY = collision[1];

                    if (objectY < nearestTopEdge) {
                        nearestTopEdge = objectY;
                    }
                }

                this.y = nearestTopEdge - this.height;
                this.vy = 0;
                this.isOnGround = true;
            } else if (this.vy < 0) {
                const firstCollision = verticalCollisions[0];
                let nearestBottomEdge = firstCollision[1] + firstCollision[3];

                for (const collision of verticalCollisions) {
                    const objectBottomEdge = collision[1] + collision[3];

                    if (objectBottomEdge > nearestBottomEdge) {
                        nearestBottomEdge = objectBottomEdge;
                    }
                }

                this.y = nearestBottomEdge;
                this.vy = 0;
            }
        }

        if (!this.dashing && this.isOnGround && (!wasOnGround || dashEnded)) {
            const deceleration = this.groundDeceleration * deltaTime;
            this.vx = Math.sign(this.vx) * Math.max(0, Math.abs(this.vx) - deceleration);
        }

        // Dash 
        const dashKeyPressed = input.isPressed('KeyC');

        if (dashKeyPressed && !this.dashing && this.dashCooldown === 0) {
            input.dash((unlock) => {
                this.dashing = true;
                this.dashTimer = 0.2;
                this.dashUnlock = unlock;
                this.vy = 0;
                this.dashDirection = (this.facing === 'right') ? 1 : -1;

                this.vx = this.dashSpeed * this.dashDirection;
            });
        }

    }

    checkForCollision(x, y) {
        const playerRight = x + this.width;
        const playerBottom = y + this.height;
        const collisions = [];

        for (const [objectX, objectY, objectWidth, objectHeight, objectType] of this.objects) {
            const overlaps =
                (x < objectX + objectWidth) &&
                (playerRight > objectX) &&
                (y < objectY + objectHeight) &&
                (playerBottom > objectY);

            if (overlaps) {
                collisions.push([objectX, objectY, objectWidth, objectHeight, objectType]);
            }
        }

        return collisions;
    }

    // draw player model at current position (white rectangle for now)
    draw(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}