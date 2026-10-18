export const PLAYER_SETTINGS = {

    // Player Dimensions (hitbox)
    width: 20,
    height: 40,

    // Speeds (px/s)
    speed: 300, // horizontal movement speed when on ground 
    airSpeed: 150, // horizontal movement speed when on air 
    dashSpeed: 600,

    // Speed Amplifiers (px/s^2)
    groundAcceleration: 2000, // horizontal movement acceleration when on ground 
    groundDeceleration: 3000, // horizontal movement deceleration when on ground 
    airDeceleration: 1000, // horizontal movement deceleration while airborne without input 
    gravity: 1600, // vertical acceleration due to gravity 

    // Upward and Downward Forces (px/s)
    jumpForce: -500, // upward jump speed 
    downForce: 350, // downward dash speed 
    
    // Constraints
    maxFallSpeed: 800

}
