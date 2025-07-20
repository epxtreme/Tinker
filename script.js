document.addEventListener("DOMContentLoaded", function () {
    const mobileLeftButton = document.getElementById("mobileLeftButton");
    const mobileRightButton = document.getElementById("mobileRightButton");
    const revealButton = document.getElementById('revealButton');
    const tryAgainButton = document.getElementById('tryAgainButton');
    const heartCounterElement = document.getElementById('heartCounter');
    const surpriseImage = document.getElementById('surpriseImage');

    function moveLeft() {
        leftPressed = true;
    }

    function stopMoveLeft() {
        leftPressed = false;
    }

    function moveRight() {
        rightPressed = true;
    }

    function stopMoveRight() {
        rightPressed = false;
    }

    if (mobileLeftButton) {
        mobileLeftButton.addEventListener("touchstart", (e) => {
            e.preventDefault();
            leftPressed = true;
        });
        mobileLeftButton.addEventListener("touchend", (e) => {
            e.preventDefault();
            leftPressed = false;
        });
        mobileLeftButton.addEventListener("touchcancel", (e) => {
            e.preventDefault();
            leftPressed = false;
        });
    }

    if (mobileRightButton) {
        mobileRightButton.addEventListener("touchstart", (e) => {
            e.preventDefault();
            rightPressed = true;
        });
        mobileRightButton.addEventListener("touchend", (e) => {
            e.preventDefault();
            rightPressed = false;
        });
        mobileRightButton.addEventListener("touchcancel", (e) => {
            e.preventDefault();
            rightPressed = false;
        });
    }

    revealButton.addEventListener('click', () => {
        document.getElementById('rightPanel').style.display = 'block';
        if (surpriseImage) {
            surpriseImage.style.display = 'block';
        }
        const updateBox = document.getElementById('updateBox');
        if (updateBox) {
            updateBox.style.display = 'block';
        }
    });

    tryAgainButton.addEventListener('click', () => {
        resetGame();
    });

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const ballRadius = 10;
    let x, y, dx, dy;

    const paddleHeight = 10;
    const paddleWidth = 120;
    let paddleX;

    const brickRowCount = 3;
    const brickColumnCount = 11;
    const brickWidth = 30;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;

    let bricks;

    let revealedMessage = '';
    const fullMessage = "YaaY! You Won my heart, again🙄.💗💗💗";

    let rightPressed = false;
    let leftPressed = false;

    let gameOver = false;

    const totalHearts = brickRowCount * brickColumnCount;
    let collectedHearts = 0;

    function updateHeartCounter() {
        heartCounterElement.textContent = `Hearts Collected: ${collectedHearts} / ${totalHearts} ❤️`;
    }

    function initBricks() {
        bricks = [];
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }
    }

    function resetGame() {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
        rightPressed = false;
        leftPressed = false;
        gameOver = false;
        revealedMessage = '';
        collectedHearts = 0;
        updateHeartCounter();
        initBricks();
        tryAgainButton.style.display = 'none';
        revealButton.style.display = 'none';
        document.getElementById('rightPanel').style.display = 'none';
        if (surpriseImage) {
            surpriseImage.style.display = 'none';
        }
        draw();
    }

    function keyDownHandler(e) {
        if (e.key === 'Right' || e.key === 'ArrowRight') {
            rightPressed = true;
        } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.key === 'Right' || e.key === 'ArrowRight') {
            rightPressed = false;
        } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
            leftPressed = false;
        }
    }

    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);

    function collisionDetection() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                let b = bricks[c][r];
                if (b.status === 1) {
                    if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        collectedHearts++;
                        updateHeartCounter();
                    }
                }
            }
        }
    }

    function drawBall() {
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
                if (bricks[c][r].status === 1) {
                    let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                    let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
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

        const reloadText = 'Press Try Again';
        const reloadTextWidth = ctx.measureText(reloadText).width;
        const reloadX = (canvas.width - reloadTextWidth) / 2;
        ctx.fillText(reloadText, reloadX, y + 30);

        tryAgainButton.style.display = 'block';
    }

    function drawMessage() {
        ctx.font = '24px Arial';
        ctx.fillStyle = '#0095DD';
        const text = fullMessage;
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;
        const textHeight = parseInt(ctx.font);
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
            revealButton.style.display = 'block';
            return;
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
                if (bricks[c][r].status === 1) {
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

    resetGame();
});
