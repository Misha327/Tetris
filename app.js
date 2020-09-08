  /**   TODO:
    *   tetrominoes rotation:
    *   [] l tetrominoe
    *   [] i tetrominoe
    *   [X] t tetrominoe
    *   [] s tetrominoe
    *   [] o tetromino e  
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

    document.addEventListener('keyup', control);
  
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
        [2, 2 + width, 2 + width*2, 3 + width]

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

    const tetrominoes = [lTetromino, iTetromino, tTetromino, sTetromino, oTetromino];
    let currLocation = 4;
    let currRotation = 0;


    // Randomly select a tetrimino and its first rotation
    let random = Math.floor(Math.random()*tetrominoes.length);
    let current = tetrominoes[random][currRotation];

    function draw() {
        current.forEach(index => {
            squares[currLocation + index].classList.add('tetromino');
        });
    }

    function undraw() {
        current.forEach(index => {
            squares[currLocation + index].classList.remove('tetromino');
        });
    }

    function control(e) {
        if (e.keyCode === 37) {
            moveLeft();
        }
        else if (e.keyCode === 38) {
            rotate();
        }
        else if (e.keyCode === 39) {
            moveRight();
        }
        else if (e.keyCode === 40) {
            // moveDown();
        }
    }

    
    function moveDown() {
        console.log(upNextTetromino);
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
            currLocation = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
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

    function rotate() {
        undraw();
        currRotation++;
        if (currRotation == current.length) {
            currRotation = 0;
        }
        current = tetrominoes[random][currRotation];
        draw();
    }

    // Show up-next tetromino in mini-grid display
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 5;
    let displayIndex = 0;
    
    const upNextTetromino = [
        [0, 0 + displayWidth, 1 , 2],
        [0, 1, 2, 3],
        [1, 2, 3, 2 + displayWidth],
        [1 + displayWidth, 2, 3, 2 + displayWidth],
        [0, 1, 0 + displayWidth, 1 + displayWidth]
    ];

    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
        });
        upNextTetromino[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino');
        });
    }

    
    button.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
        else {
            draw();
            timerId = setInterval(moveDown, 250);
            displayShape();
        }
    })

    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
            
            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
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