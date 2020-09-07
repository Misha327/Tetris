document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const width = 10;
    const score = document.querySelector('#score');
    const button = document.querySelector('#start-button');
    let nextRandom = 0;
    document.addEventListener('keyup', control);

    // Tetriminoes
    const lTetromino = [
        [1 + width, 2 + width, 3 + width, 1 + width * 2],
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
        [2, 1 + width, 2 + width, 3 + width],
        [1, 1 + width, 2 + width, 1 + width * 2],
        [1 + width, 2 + width, 3 + width, 2 + width * 2],
        [2, 1 + width, 2 + width, 2 + width * 2]
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

    // Move the tetromino down every second
    timerId = setInterval(moveDown, 200);

    function moveDown() {
        console.log(upNextTetromino);
        undraw();
        currLocation = currLocation + width;
        draw();
        freeze();
    }

    draw();

    // Freeze function
    function freeze() {
        if (current.some(index => squares[currLocation + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currLocation + index].classList.add('taken'));
            // Start a new random tetromino falling
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * tetrominoes.length);
            current = tetrominoes[random][currRotation];
            currLocation = 4;
            draw();
            displayShape();
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
    const displayWidth = 4;
    let displayIndex = 0;
    
    const upNextTetromino = [lTetromino[0], iTetromino[0], tTetromino[0], sTetromino[0], oTetromino[0]];

    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
        });
        upNextTetromino[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino');
        });
    }

    // if ()
    
    // moveDown();

    
})