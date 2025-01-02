// board
let board;
let boardWidth = 500;
let boardHeight = 500;
let context;

// players
let playerWidth = 10;
let playerHeight = 50;
let playerVelocityY = 0;

// buttons
let startButton;
let playAgainButton;

// player(paddle) properties
let player1 = {
    x : 10,
    y : boardHeight/2,
    width : playerWidth,
    height : playerHeight,
    velocityY : playerVelocityY
}
let player2 = {
    x : boardWidth - playerWidth - 10,
    y : boardHeight/2,
    width : playerWidth,
    height : playerHeight,
    velocityY : playerVelocityY
}

// ball
let ballWidth = 10;
let ballHeight = 10;
let ball = {
    x : boardWidth/2,
    y : boardHeight/2,
    width : ballWidth,
    height : ballHeight,
    velocityX : 1, // half as fast as moving vertically
    velocityY : 2
}

let player1Score = 0;
let player2Score = 0;

window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); // used for drawing on the board

    // draw initial player1
    context.fillStyle = "green";
    context.fillRect(player1.x, player1.y, player1.width, player1.height);

    requestAnimationFrame(update);

    // enable player controls
    document.addEventListener("keyup", movePlayer);
}

// game loop
function update(){
    // start game loop
    animateGame = requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);
    // player 1
    context.fillStyle = "green";
    // player1.y += player1.velocityY; 
    // instead we check if player is within bounds before updating
    let nextPlayer1Y = player1.y + player1.velocityY;
    if(!outOfBounds(nextPlayer1Y)){
        player1.y = nextPlayer1Y;
    }

    context.fillRect(player1.x, player1.y, player1.width, player1.height);

    //  player 2
    // player2.y += player2.velocityY;
    let nextPlayer2Y = player2.y + player2.velocityY;
    if(!outOfBounds(nextPlayer2Y)){
        player2.y = nextPlayer2Y;
    }
    context.fillRect(player2.x, player2.y, player2.width, player2.height);

    // ball
    context.fillStyle = "white";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    // if ball touches top or bottom of canvas
    if(ball.y <= 0 || (ball.y + ball.height >= boardHeight)){
        ball.velocityY *= -1; // reverse direction
    }

    // bounce the ball back
    if (detectCollision(ball, player1)){
        if (ball.x <= player1.x + player1.width){
            // left side of ball touches right side of player1
            ball.velocityX *= -1; // flip x direction
        }
    }
    else if (detectCollision(ball, player2)){
        if (ball.x + ballWidth >= player2.x){
            // right side of ball touches left side of player2
            ball.velocityX *= -1; // flip x direction
        }
    }

    // round over
    if(ball.x < 0){
        player2Score++;
        resetGame(1);
    }
    else if(ball.x + ball.width > boardWidth){
        player1Score++;
        resetGame(-1);
    }

    // draw score
    context.font = "45px sans-serif";
    context.fillText(player1Score, boardWidth/5, 45);
    context.fillText(player2Score, boardWidth*4/5 -45, 45);

    // draw dotted line down the middle
    for (let i = 10; i < board.height; i += 25){
        // i = starting y position, draw a square every 25 pixels down
        // (x position = half of boardWidth - 10), i = y position, width = 5, height = 5
        context.fillRect(board.width/2 - 10, i, 5, 5);
    }

    // end the game based on who wins
    if(player1Score == 11){
        gameOver(player1);
    }
    else if(player2Score == 11){
        gameOver(player2);
    }
}

// boolean to check if the paddle is out of bounds
function outOfBounds(yPosition){
    return (yPosition < 0 || yPosition + playerHeight > boardHeight);
}

function movePlayer(e) { 
    // player 1
    if(e.code == "KeyW"){
        player1.velocityY = -3;
    }
    else if (e.code == "KeyS"){
        player1.velocityY = 3;
    }

    // player 2
    if(e.code == "ArrowUp"){
        player2.velocityY = -3;
    }
    else if(e.code == "ArrowDown"){
        player2.velocityY = 3;
    }
}

// general function to check for collisions
function detectCollision(a, b){
    return a.x < b.x + b.width && // a's top left corner doesn't reach b's top right corner
        a.x + a.width > b.x && // a's top right corner passes b's top left corner
        a.y < b.y + b.height && //a's top left corner doens't reach b's bottom left corner
        a.y + a.height > b.y; // a's bottom left corner passes b's top left corner
}

function resetGame(direction){ // direction will be the new velocityX for the new round
    // ball changes direction based on who wins
    ball = {
        x : boardWidth/2,
        y : boardHeight/2,
        width : ballWidth,
        height : ballHeight,
        velocityX : direction,
        velocityY : 2
    }
}

function gameOver(winner){
    const winMessage = winner + " wins!";
    context.font = "40px sans-serif";
    context.fillText = (winMessage, boardWidth/2, 250);

    cancelAnimationFrame(animateGame);

}