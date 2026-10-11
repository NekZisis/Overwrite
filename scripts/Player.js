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
        this.y = this.gameHeight - this.height - 40;

        // velocity vectors (px/s)
        this.vx = 0;
        this.vy = 0;

        // velocity value constants (px/s)
        this.speed = 350;        // horizontal movement speed (px/s)
        this.jumpForce = -550;   // upward jump speed (px/s)
        this.downForce = 500;   //  downward movement speed (px/s)
        this.gravity = 1500;     // acceleration due to gravity (px/s^2)

        // state variables
        this.facing = "right";
        this.isOnGround = false;
        this.dashing = false;
        this.dashTimer = 0;
        this.dashCooldown = 0;
        this.dashUnlock = null;
        this.dashDirection = 1;
        this.latched = false; 
        this.disableGravity = false;

        // coyote timer
        this.coyoteTime = 0.05 // 50 ms
        this.coyoteTimer = 0;
    }

    update(deltaTime, input) {
        if (this.dashing) {
            this.dashTimer -= deltaTime;

            if (this.dashTimer <= 1e-9) {
                this.dashing = false;
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
            this.vx = 900 * this.dashDirection;
            this.vy = 0;
        }

        // Horizontal Input Handling
        const leftPressed = input.isPressed('KeyA');
        const rightPressed = input.isPressed('KeyD');

        if (!this.dashing && leftPressed && !rightPressed) {
            this.vx = -this.speed;
            this.facing = "left";
        } else if (!this.dashing && rightPressed && !leftPressed) {
            this.vx = this.speed;
            this.facing = "right";
        } else if (!this.dashing && !rightPressed && !leftPressed) {
            this.vx = 0;
        } 

        // Vertical / Jump Input Handling
        const jumpPressed = input.isPressed('KeyW');
        if (!this.dashing) {
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
        }

        // Vertical / Downwards Input Handling
        const downPressed = input.isPressed('KeyS');

        if (!this.dashing && downPressed && !this.isOnGround) {
            this.vy = this.downForce;
        }

        // Horizontal movement and collision resolution
        const nextX = this.x + this.vx * deltaTime;
        const horizontalCollisions = this.checkForCollision(nextX, this.y);

        if (horizontalCollisions.length === 0) {
            this.x = nextX;
        } else if (this.vx > 0) {
            let nearestLeftEdge = horizontalCollisions[0][0];

            for (const collision of horizontalCollisions) {
                const objectX = collision[0];

                if (objectX < nearestLeftEdge) {
                    nearestLeftEdge = objectX;
                }
            }

            this.x = nearestLeftEdge - this.width;
            this.vx = 0;

        } else if (this.vx < 0) {
            const firstCollision = horizontalCollisions[0];
            let nearestRightEdge = firstCollision[0] + firstCollision[2];

            for (const collision of horizontalCollisions) {
                const objectRightEdge = collision[0] + collision[2];

                if (objectRightEdge > nearestRightEdge) {
                    nearestRightEdge = objectRightEdge;
                }
            }

            this.x = nearestRightEdge;
            this.vx = 0;
        }

        // Vertical movement and collision resolution
        if (this.dashing) {
            this.vy = 0;
        } else {
            this.isOnGround = false;
            if (!this.disableGravity) this.vy += this.gravity * deltaTime;
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

        // Dash 
        const spacePressed = input.isPressed('Space');

        if (spacePressed && !this.dashing && this.dashCooldown === 0) {
            input.dash((unlock) => {
                this.dashing = true;
                this.dashTimer = 0.2;
                this.dashUnlock = unlock;
                this.vy = 0;
                this.dashDirection = this.facing === 'right' ? 1 : -1;

                this.vx = 900 * this.dashDirection;
            });
        }

    }

    checkForCollision(x, y) {
        const playerRight = x + this.width;
        const playerBottom = y + this.height;
        const collisions = [];

        for (const [objectX, objectY, objectWidth, objectHeight] of this.objects) {
            const overlaps =
                (x < objectX + objectWidth) &&
                (playerRight > objectX) &&
                (y < objectY + objectHeight) &&
                (playerBottom > objectY);

            if (overlaps) {
                collisions.push([objectX, objectY, objectWidth, objectHeight]);
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