export function updatePlayerMovement(player, deltaTime, input) {
    const wasOnGround = player.isOnGround;
    let dashEnded = false;

    if (player.dashing) {
        player.dashTimer -= deltaTime;

        if (player.dashTimer <= 1e-9) {
            player.dashing = false;
            dashEnded = true;
            player.dashTimer = 0;
            player.dashCooldown = 0.5;
            player.dashUnlock();
            player.dashUnlock = null;
        }
    } else if (player.dashCooldown > 0) {
        player.dashCooldown = Math.max(0, player.dashCooldown - deltaTime);
        if (player.dashCooldown <= 1e-9) player.dashCooldown = 0;
    }

    if (player.dashing) {
        player.vx = player.dashSpeed * player.dashDirection;
        player.vy = 0;
    }

    // horizontal movement
    const leftPressed = input.isPressed('KeyA');
    const rightPressed = input.isPressed('KeyD');
    const turnAcceleration = player.groundAcceleration * 4;
    let movementDirection = 0;

    if (!player.dashing && leftPressed && !rightPressed) {
        // unlatch from right wall
        if (player.wallLatched === 'right') {
            player.toggleGravity = true;
            player.coyoteTimer = 0.1;
            player.wallLatched = null;
        }
        movementDirection = -1;
        player.facing = "left";

    } else if (!player.dashing && rightPressed && !leftPressed) {
        // unlatch from left wall
        if (player.wallLatched === 'left') {
            player.toggleGravity = true;
            player.coyoteTimer = 0.1;
            player.wallLatched = null;
        }
        movementDirection = 1;
        player.facing = "right";
    } else if (!player.dashing && !rightPressed && !leftPressed) { // 
        const deceleration = (player.isOnGround ? player.groundDeceleration : player.airDeceleration) * deltaTime;
        player.vx = Math.sign(player.vx) * Math.max(0, Math.abs(player.vx) - deceleration);
    } 

    if (movementDirection !== 0) {
        if (player.isOnGround) {
            const targetSpeed = movementDirection * player.speed;
            const speedDifference = targetSpeed - player.vx;
            const acceleration = player.vx * movementDirection < 0
                ? turnAcceleration
                : player.groundAcceleration;
            player.vx += Math.sign(speedDifference) * Math.min(
                Math.abs(speedDifference),
                acceleration * deltaTime
            );
        } else {
            const targetSpeed = player.vy > 0 ? player.airSpeed : player.speed;

            if (player.vx * movementDirection < 0) {
                const speedDifference = movementDirection * targetSpeed - player.vx;
                player.vx += Math.sign(speedDifference) * Math.min(
                    Math.abs(speedDifference),
                    turnAcceleration * deltaTime
                );
            } else if (player.vx * movementDirection < targetSpeed) {
                // Preserve higher momentum in the chosen direction.
                player.vx = movementDirection * targetSpeed;
            }
        }
    }

    // Jump
    const jumpPressed = input.isPressed('KeyW');
    if (player.dashing) {
        player.coyoteTimer = Math.max(0, player.coyoteTimer - deltaTime);
    } else {
        if (player.isOnGround) {
            player.coyoteTimer = player.coyoteTime;
        } else {
            player.coyoteTimer = Math.max(0, player.coyoteTimer - deltaTime);
        }

        if (jumpPressed && player.coyoteTimer > 0) {

            player.vy = player.jumpForce;
            player.isOnGround = false;
            player.coyoteTimer = 0;
        }

        if (jumpPressed && player.wallLatched && (rightPressed !== leftPressed)) {
            player.toggleGravity = true;
            player.coyoteTime = 0.05; // reset coyote time
            player.wallLatched = false;

            player.vy = player.jumpForce;
            player.isOnGround = false;
            player.coyoteTimer = 0;
        }
    }

    // Down Dash
    const downPressed = input.isPressed('KeyS');
    if (!player.dashing && downPressed && !player.isOnGround && !player.wallLatched) {
        if (player.downForce > player.vy) player.vy = player.downForce;
    }

    // Horizontal movement and collision resolution
    const nextX = player.x + player.vx * deltaTime;
    const horizontalCollisions = player.checkForCollision(nextX, player.y);

    if (horizontalCollisions.length === 0) {
        player.x = nextX;
    } else if (player.vx > 0) {
        let nearestCollision = horizontalCollisions[0];

        for (const collision of horizontalCollisions) {
            if (collision.x < nearestCollision.x) {
                nearestCollision = collision;
            }
        }

        player.x = nearestCollision.x - player.width;
        player.vx = 0;

        // latching on a right wall

        if (nearestCollision.material === 'vines') {
            player.wallLatched = 'right';
            player.toggleGravity = false;
            player.vy = 0;
            player.isOnGround = true;
        } else if (nearestCollision.material === 'stone') {

        }


    } else if (player.vx < 0) {
        let nearestCollision = horizontalCollisions[0];

        for (const collision of horizontalCollisions) {
            if (collision.x + collision.width > nearestCollision.x + nearestCollision.width) {
                nearestCollision = collision;
            }
        }

        player.x = nearestCollision.x + nearestCollision.width;
        player.vx = 0;

        // latching on a left wall

        if (nearestCollision.material === 'vines') {
            player.wallLatched = 'left';
            player.toggleGravity = false;
            player.vy = 0;
            player.isOnGround = true;
        }

    }

    // Vertical movement and collision resolution
    if (player.dashing) {
        player.vy = 0;
    } else {
        player.isOnGround = false;
        if (player.toggleGravity) player.vy += player.gravity * deltaTime;
        player.vy = Math.min(player.vy, player.maxFallSpeed);
        const nextY = player.y + player.vy * deltaTime;
        const verticalCollisions = player.checkForCollision(player.x, nextY);

        if (verticalCollisions.length === 0) {
            player.y = nextY;
        } else if (player.vy > 0) {
            let nearestTopEdge = verticalCollisions[0].y;

            for (const collision of verticalCollisions) {
                if (collision.y < nearestTopEdge) {
                    nearestTopEdge = collision.y;
                }
            }

            player.y = nearestTopEdge - player.height;
            player.vy = 0;
            player.isOnGround = true;
        } else if (player.vy < 0) {
            let nearestBottomEdge = verticalCollisions[0].y + verticalCollisions[0].height;

            for (const collision of verticalCollisions) {
                const collisionBottomEdge = collision.y + collision.height;

                if (collisionBottomEdge > nearestBottomEdge) {
                    nearestBottomEdge = collisionBottomEdge;
                }
            }

            player.y = nearestBottomEdge;
            player.vy = 0;
        }
    }

    if (!player.dashing && player.isOnGround && (!wasOnGround || dashEnded)) {
        if (!wasOnGround) {
            player.vx = Math.sign(player.vx) * Math.min(Math.abs(player.vx), player.speed);
        } else {
            const deceleration = player.groundDeceleration * deltaTime;
            player.vx = Math.sign(player.vx) * Math.max(0, Math.abs(player.vx) - deceleration);
        }
    }

    // Dash 
    const dashKeyPressed = input.isPressed('KeyC');

    if (dashKeyPressed && !player.dashing && player.dashCooldown === 0) {
        input.dash((unlock) => {
            player.dashing = true;
            player.dashTimer = 0.2;
            player.dashUnlock = unlock;
            player.vy = 0;
            player.dashDirection = (player.facing === 'right') ? 1 : -1;

            player.vx = player.dashSpeed * player.dashDirection;
        });
    }
}
