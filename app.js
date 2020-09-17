/**TODO:
 *  [X] align the scene
 *  [] prevent movement during pause    
 *  [] make start button restart the game after gameover
 *  [] fix invisible tetromino after row clear
 *  [] stop piece from overlapping when rotated into another
  */
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const width = 10;
    const scoreDisplay = document.querySelector('#score');
    const button = document.querySelector('#start-button');
    var nextRandom = 0;
    let timerId;
    let score = 0;
    document.addEventListener('keydown', control);
    document.addEventListener('keyup', function () {
        down = false;
    })

    // Tetriminoes
    const lTetromino = [
        [1, 2, 3, 1 + width],
        [1, 2, 2 + width, 2 + width * 2],
        [1 + width * 2, 2 + width * 2, 3 + width * 2, 3 + width],
        [1, width + 1, width * 2 + 1, width * 2 + 2]
    ];

    const iTetromino = [
        [1, 2, 3, 4],
        [1, 1 + width, 1 + width * 2, 1 + width * 3],
        [1, 2, 3, 4],
        [1, 1 + width, 1 + width * 2, 1 + width * 3]
    ];

    const tTetromino = [
        [1, 2, 3, 2 + width],
        [2, 1 + width, 2 + width, 2 + width * 2],
        [2, 1 + width, 2 + width, 3 + width],
        [2, 2 + width, 2 + width * 2, 3 + width]

    ];

    const sTetromino = [
        [1 + width, 2, 3, 2 + width],
        [1, 1 + width, 2 + width, 2 + width * 2],
        [1 + width, 2, 3, 2 + width],
        [1, 1 + width, 2 + width, 2 + width * 2]
    ];

    const oTetromino = [
        [1, 2, 1 + width, 2 + width],
        [1, 2, 1 + width, 2 + width],
        [1, 2, 1 + width, 2 + width],
        [1, 2, 1 + width, 2 + width]
    ];

    let color = ['green', 'blue', 'red', 'purple', 'orange'];

    const tetrominoes = [lTetromino, iTetromino, tTetromino, sTetromino, oTetromino];
    let currLocation = 3;
    let currRotation = 0;


    // Randomly select a tetrimino in its first rotation
    let random = Math.floor(Math.random() * tetrominoes.length);
    let current = tetrominoes[random][currRotation];

    function draw() {
        current.forEach(index => {
            squares[currLocation + index].classList.add('tetromino');
            squares[currLocation + index].style.backgroundColor = color[random];
        });
    }

    function undraw() {
        current.forEach(index => {
            squares[currLocation + index].classList.remove('tetromino');
            squares[currLocation + index].style.backgroundColor = '';

        });
    }

    let down = false;
    function control(e) {
        if (e.keyCode === 37) {
            moveLeft();
        }
        if (e.keyCode === 38) {
            if (down) return;
            rotate();
            down = true;

        }
        if (e.keyCode === 39) {
            moveRight();
        }
        if (e.keyCode === 40) {
            moveDown();
        }
        if (e.repeat) { return }
    }

    function gameLoop() {
        // console.log(currRotation);
        undraw();
        currLocation = currLocation + width;
        draw();
        freeze();
    }

    // Freeze function
    function freeze() {
        if (current.some(index => squares[currLocation + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currLocation + index].classList.add('taken'));
            // Start a new random tetromino falling
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * tetrominoes.length);
            current = tetrominoes[random][0];
            currLocation = 3;
            draw();
            displayShape();
            addScore();
            gameOver();
            currRotation = 0;
        }
    }

    // Move the tetromino left, unless it is at the the edge
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currLocation + index) % width == 0);
        if (!isAtLeftEdge) {
            currLocation -= 1;
        }
        if (current.some(index => squares[currLocation + index].classList.contains('taken'))) {
            currLocation += 1;
        }
        draw();
    }

    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currLocation + index) % width == 9);
        if (!isAtRightEdge) {
            currLocation += 1;
        }
        if (current.some(index => squares[currLocation + index].classList.contains('taken'))) {
            currLocation -= 1;
        }
        draw();
    }

    function moveDown() {
        
    }

    function rotate() {
        let nextRotation = currRotation + 1;
        if (nextRotation == current.length) {
            nextRotation = 0;
        }
        const isAtLeftEdge = tetrominoes[random][nextRotation].some(index => (currLocation + index) % width == 0);
        const isAtRightEdge = tetrominoes[random][nextRotation].some(index => (currLocation + index) % width == 9);

        // console.log(currRotation);
        // console.log(isAtLeftEdge);
        // console.log(isAtRightEdge);


        if (isAtRightEdge && isAtLeftEdge) {
            return;
        }
        else {
            undraw();

            currRotation++;
            if (currRotation == current.length) {
                currRotation = 0;
            }
            current = tetrominoes[random][currRotation];
            draw();
        }
    }

    // Show up-next tetromino in mini-grid display
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 5;
    const displayIndex = 0;

    const upNextTetromino = [
        [0, 0 + displayWidth, 1, 2],
        [0, 1, 2, 3],
        [1, 2, 3, 2 + displayWidth],
        [1 + displayWidth, 2, 3, 2 + displayWidth],
        [0, 1, 0 + displayWidth, 1 + displayWidth]
    ];

    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
            square.style.backgroundColor = '';
        });
        upNextTetromino[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino');
            displaySquares[displayIndex + index].style.backgroundColor = color[nextRandom];
        });
    }

    button.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
        else {
            draw();
            timerId = setInterval(gameLoop, 350);
            displayShape();
        }
    })

    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 5000000;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                    squares[index].style.backgroundColor = '';
                });
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }

    function gameOver() {
        if (current.some(index => squares[currLocation + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'GAME OVER';
            clearInterval(timerId);
        }
    }


})