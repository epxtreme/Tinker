document.addEventListener("DOMContentLoaded", function() {
    const leftButton = document.getElementById("leftButton");
    const rightButton = document.getElementById("rightButton");
    const mobileLeftButton = document.getElementById("mobileLeftButton");
    const mobileRightButton = document.getElementById("mobileRightButton");

    let touchIdentifierLeft = null;
    let touchIdentifierRight = null;

    function moveLeft() {
        console.log("Move left");
        // Add your logic to move left here
    }

    function moveRight() {
        console.log("Move right");
        // Add your logic to move right here
    }

    // Add event listeners for both click and touch events
    leftButton.addEventListener("click", moveLeft);
    leftButton.addEventListener("touchstart", function(event) {
        event.preventDefault();
        if (event.touches.length === 1) {
            touchIdentifierLeft = event.touches[0].identifier;
            moveLeft();
        }
    });
    leftButton.addEventListener("touchend", function(event) {
        if (event.changedTouches.length === 1 && event.changedTouches[0].identifier === touchIdentifierLeft) {
            touchIdentifierLeft = null;
        }
    });

    rightButton.addEventListener("click", moveRight);
    rightButton.addEventListener("touchstart", function(event) {
        event.preventDefault();
        if (event.touches.length === 1) {
            touchIdentifierRight = event.touches[0].identifier;
            moveRight();
        }
    });
    rightButton.addEventListener("touchend", function(event) {
        if (event.changedTouches.length === 1 && event.changedTouches[0].identifier === touchIdentifierRight) {
            touchIdentifierRight = null;
        }
    });

    // Event listeners for mobile buttons
    mobileLeftButton.addEventListener("touchstart", function(event) {
        event.preventDefault();
        touchIdentifierLeft = event.touches[0].identifier;
        moveLeft();
    });
    mobileLeftButton.addEventListener("touchend", function(event) {
        if (event.changedTouches.length === 1 && event.changedTouches[0].identifier === touchIdentifierLeft) {
            touchIdentifierLeft = null;
        }
    });

    mobileRightButton.addEventListener("touchstart", function(event) {
        event.preventDefault();
        touchIdentifierRight = event.touches[0].identifier;
        moveRight();
    });
    mobileRightButton.addEventListener("touchend", function(event) {
        if (event.changedTouches.length === 1 && event.changedTouches[0].identifier === touchIdentifierRight) {
            touchIdentifierRight = null;
        }
    });

    document.getElementById('revealButton').addEventListener('click', () => {
        document.getElementById('rightPanel').style.display = 'block';
    });
});

// The game script
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ball (Heart Emoji)
const ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

// Paddle
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// Bricks
const brickRowCount = 3;
const brickColumnCount = 11;
const brickWidth = 30;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

let revealedMessage = '';
const fullMessage = "YaaY! You Won my heart, again🙄.💗💗💗";
const messagePieces = fullMessage.split('');

let rightPressed = false;
let leftPressed = false;

let gameOver = false;

// Add event listeners for button clicks
document.getElementById('leftButton').addEventListener('mousedown', () => { leftPressed = true; });
document.getElementById('leftButton').addEventListener('mouseup', () => { leftPressed = false; });
document.getElementById('rightButton').addEventListener('mousedown', () => { rightPressed = true; });
document.getElementById('rightButton').addEventListener('mouseup', () => { rightPressed = false; });

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key == 'Right' || e.key == 'ArrowRight') {
        rightPressed = true;
    } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == 'Right' || e.key == 'ArrowRight') {
        rightPressed = false;
    } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
        leftPressed = false;
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                }
            }
        }
    }
}

function drawBall() {
    // Heart Emoji
    ctx.beginPath();
    ctx.font = '20px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText('🖤', x - ballRadius, y + ballRadius);
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                // Draw heart emoji instead of rectangle
                ctx.beginPath();
                ctx.font = '20px Arial';
                ctx.fillStyle = 'red';
                ctx.fillText('❤️', brickX, brickY + brickHeight);
                ctx.closePath();
            }
        }
    }
}

function drawGameOver() {
    ctx.font = '24px Arial';
    ctx.fillStyle = '#0095DD';
    const text = 'You Lost my heart!🥺🥺😭';
    const textWidth = ctx.measureText(text).width;
    const x = (canvas.width - textWidth) / 2;
    const y = canvas.height / 2 - 10;
    ctx.fillText(text, x, y);
    
    const reloadText = 'Reload to Try Again';
    const reloadTextWidth = ctx.measureText(reloadText).width;
    const reloadX = (canvas.width - reloadTextWidth) / 2;
    ctx.fillText(reloadText, reloadX, y + 30);
}

function drawMessage() {
    ctx.font = '24px Arial';
    ctx.fillStyle = '#0095DD';
    const text = fullMessage;
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const textHeight = parseInt(ctx.font); // Approximate height based on font size

    const x = (canvas.width - textWidth) / 2;
    const y = (canvas.height - textHeight) / 2;
    ctx.fillText(text, x, y);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    if (revealedMessage.length === fullMessage.length) {
        drawMessage();
        document.getElementById('revealButton').style.display = 'block'; // Show the button when the game is won
        return; // Stop updating if the game is won
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            gameOver = true;
        }
    }

    x += dx;
    y += dy;

    let brickCount = 0;
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                brickCount++;
            }
        }
    }

    if (brickCount === 0) {
        revealedMessage = fullMessage;
    }

    if (gameOver) {
                drawGameOver();
    } else {
        requestAnimationFrame(draw);
    }
}

draw();


