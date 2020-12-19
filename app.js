/**TODO:
 *  [X] align the scene
 *  [] prevent movement during pause
 *  [] make start button restart the game after gameover
 *  [] fix invisible tetromino after row clear
 *  [] stop piece from overlapping when rotated into another
 */

document.addEventListener("DOMContentLoaded", () => {
	const grid = document.querySelector(".grid");
	const miniGrid = document.querySelector(".mini-grid");
	let squares = Array.from(document.querySelectorAll(".grid div"));
	const width = 10;
	const scoreDisplay = document.querySelector("#score");
	const button = document.querySelector("#start-button");
	const pauseOverlay = document.getElementById("overlay");
	const pauseMiniOverlay = document.getElementById("mini-overlay");
	var nextRandom = 0;
	let timerId;
	let score = 0;
	let gameFinished = false;
	let isPaused = false;
	let gameSpeed = 800;
	let disabled = false;
	document.addEventListener("keydown", control);
	document.addEventListener("keyup", function () {
		down = false;
	});

	// Tetriminoes
	const lTetromino = [
		[1 + width, 2 + width, 3 + width, 1 + width * 2],
		[1, 2, 2 + width, 2 + width * 2],
		[1 + width * 2, 2 + width * 2, 3 + width * 2, 3 + width],
		[2, width + 2, width * 2 + 2, width * 2 + 3],
	];

	const iTetromino = [
		[1 + width, 2 + width, 3 + width, 4 + width],
		[3, 3 + width, 3 + width * 2, 3 + width * 3],
		[1 + width * 2, 2 + width * 2, 3 + width * 2, 4 + width * 2],
		[2, 2 + width, 2 + width * 2, 2 + width * 3],
	];

	const tTetromino = [
		[1 + width, 2 + width, 3 + width, 2],
		[2, 3 + width, 2 + width, 2 + width * 2],
		[1 + width, 2 + width, 3 + width, 2 + width * 2],
		[2, 2 + width, 2 + width * 2, 1 + width],
	];

	const sTetromino = [
		[1 + width, 2, 3, 2 + width],
		[2, 2 + width, 3 + width, 3 + width * 2],
		[2 + width, 1 + width * 2, 2 + width * 2, 3 + width],
		[1, 1 + width, 2 + width, 2 + width * 2],
	];

	const oTetromino = [
		[1, 2, 1 + width, 2 + width],
		[1, 2, 1 + width, 2 + width],
		[1, 2, 1 + width, 2 + width],
		[1, 2, 1 + width, 2 + width],
	];

	let color = [
		"rgba(151, 90, 160, 0.70)",
		"rgba(200, 202, 83, 0.70)",
		"rgba(239, 123, 123, 0.72)",
		"rgba(102, 186, 214, 0.70)",
		"rgba(92, 188, 98, 0.70)",
	];

	const tetrominoes = [
		lTetromino,
		iTetromino,
		tTetromino,
		sTetromino,
		oTetromino,
	];
	let currLocation = 3;
	let currRotation = 0;

	// Randomly select a tetrimino in its first rotation
	let random = Math.floor(Math.random() * tetrominoes.length);
	let current = tetrominoes[random][currRotation];

	function draw() {
		current.forEach((index) => {
			squares[currLocation + index].classList.add("tetromino");
			squares[currLocation + index].style.backgroundColor = color[random];
		});
	}

	function undraw() {
		current.forEach((index) => {
			squares[currLocation + index].classList.remove("tetromino");
			squares[currLocation + index].style.backgroundColor = "";
		});
	}

	let down = false;
	function control(e) {
		if (!gameFinished) {
			if (timerId) {
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
				if (e.repeat) {
					return;
				}
			}
		}
	}

	// Freeze function

	// Move the tetromino left, unless it is at the the edge
	function moveLeft() {
		undraw();
		const isAtLeftEdge = current.some(
			(index) => (currLocation + index) % width == 0
		);
		if (!isAtLeftEdge) {
			currLocation -= 1;
		}
		if (
			current.some((index) =>
				squares[currLocation + index].classList.contains("taken")
			)
		) {
			currLocation += 1;
		}
		draw();
		freeze();
	}

	function moveRight() {
		undraw();
		const isAtRightEdge = current.some(
			(index) => (currLocation + index) % width == 9
		);

		if (!isAtRightEdge) {
			currLocation += 1;
		}
		if (
			current.some((index) =>
				squares[currLocation + index].classList.contains("taken")
			)
		) {
			currLocation -= 1;
		}
		draw();
		freeze();
	}

	function moveDown() {
		undraw();
		currLocation += 10;
		draw();
		freeze();
	}

	function rotate() {
		let nextRotation = currRotation + 1;
		if (nextRotation == current.length) {
			nextRotation = 0;
		}
		const isAtLeftEdge = tetrominoes[random][nextRotation].some(
			(index) => (currLocation + index) % width == 0
		);
		const isAtRightEdge = tetrominoes[random][nextRotation].some(
			(index) => (currLocation + index) % width == 9
		);
		const boo = tetrominoes[random][nextRotation].some((index) =>
			console.log((currLocation + index) % width)
		);

		const isTouchingLeft = tetrominoes[random][nextRotation].some((index) =>
			squares[currLocation + index - 1].classList.contains("taken")
		);
		const isTouchingRight = tetrominoes[random][nextRotation].some((index) =>
			// Check right
			squares[currLocation + index + 1].classList.contains("taken")
		);

		if (isTouchingLeft || isTouchingRight) {
			console.log("gday");
			return;
		}

		if (isAtRightEdge && isAtLeftEdge) {
			console.log("helo");
			return;
		} else {
			undraw();

			currRotation++;
			if (currRotation == current.length) {
				currRotation = 0;
			}
			current = tetrominoes[random][currRotation];
			draw();
		}
		freeze();
	}

	// Show up-next tetromino in mini-grid display
	const displaySquares = document.querySelectorAll(".mini-grid div");
	const displayWidth = 7;
	const displayIndex = 0;

	const upNextTetromino = [
		// L
		[
			2 + displayWidth * 2,
			2 + displayWidth * 3,
			3 + displayWidth * 2,
			4 + displayWidth * 2,
		],
		// I
		[
			1 + displayWidth * 2,
			2 + displayWidth * 2,
			3 + displayWidth * 2,
			4 + displayWidth * 2,
		],
		// T
		[
			2 + displayWidth * 2,
			3 + displayWidth * 2,
			4 + displayWidth * 2,
			3 + displayWidth * 3,
		],
		// S
		[
			2 + displayWidth * 3,
			3 + displayWidth * 2,
			4 + displayWidth * 2,
			3 + displayWidth * 3,
		],
		//  O
		[
			2 + displayWidth * 2,
			3 + displayWidth * 2,
			2 + displayWidth * 3,
			3 + displayWidth * 3,
		],
	];

	function displayShape() {
		displaySquares.forEach((square) => {
			square.classList.remove("tetromino");
			square.style.backgroundColor = "";
		});
		upNextTetromino[nextRandom].forEach((index) => {
			displaySquares[displayIndex + index].classList.add("tetromino");
			displaySquares[displayIndex + index].style.backgroundColor =
				color[nextRandom];
		});
	}

	button.addEventListener("click", () => {
		if (timerId) {
			clearInterval(timerId);
			timerId = null;
			isPaused = true;

			if (gameFinished) {
				console.log("in 1");
				pauseOverlay.classList.remove("overlay");
				pauseOverlay.textContent = "";
				isPaused = false;

				squares.forEach((square) => {
					if (
						square.classList.contains("tetromino") ||
						square.classList.contains("taken")
					) {
						square.classList.remove("tetromino");
						square.classList.remove("taken");
						square.style.backgroundColor = null;
					}
				});
			}
			gameFinished = false;

			if (isPaused) {
				pauseMiniOverlay.classList.add("overlay");
				pauseOverlay.classList.add("overlay");
				pauseOverlay.appendChild(document.createTextNode("Paused"));
			}
		} else {
			displayShape();
			if (isPaused) {
				pauseOverlay.classList.remove("overlay");
				pauseMiniOverlay.classList.remove("overlay");
				pauseOverlay.textContent = "";

				isPaused = false;
			}

			timerId = setInterval(gameLoop, gameSpeed);
		}
	});

	function freeze() {
		const atBottom = current.some((index) => {
			const nextLocation = index + currLocation + width;
			if (nextLocation >= 200) {
				current.forEach((index) => {
					squares[currLocation + index].classList.add("taken");
				});

				random = nextRandom;
				nextRandom = Math.floor(Math.random() * tetrominoes.length);
				current = tetrominoes[random][0];
				displayShape();

				currLocation = 3;
				currRotation = 0;
				draw();
				addScore();
				gameOver();
			}
		});
		if (
			current.some((index) =>
				squares[currLocation + index + width].classList.contains("taken")
			)
		) {
			disabled = true;
			current.forEach((index) =>
				squares[currLocation + index].classList.add("taken")
			);

			// Start a new random tetromino falling
			random = nextRandom;
			nextRandom = Math.floor(Math.random() * tetrominoes.length);
			current = tetrominoes[random][0];
			currLocation = 3;
			currRotation = 0;
			displayShape();

			draw();
			addScore();
			gameOver();
			disabled = false;
		}
	}
	function addScore() {
		for (let i = 0; i < 199; i += width) {
			const row = [
				i,
				i + 1,
				i + 2,
				i + 3,
				i + 4,
				i + 5,
				i + 6,
				i + 7,
				i + 8,
				i + 9,
			];

			if (row.every((index) => squares[index].classList.contains("taken"))) {
				score += 10;
				scoreDisplay.innerHTML = score;
				row.forEach((index) => {
					squares[index].classList.remove("taken");
					squares[index].classList.remove("tetromino");
					squares[index].style.backgroundColor = "";
				});
				console.log(i);
				const squaresRemoved = squares.splice(i, width);
				squares = squaresRemoved.concat(squares);
				squares.forEach((cell) => grid.appendChild(cell));
				if (score % 100 == 0) {
					gameSpeed += 200;
				}
			}
		}
	}

	function gameLoop() {
		// console.log(currRotation);
		freeze();
		undraw();
		currLocation = currLocation + width;
    draw();

	}

	function gameOver() {
		if (
			current.some((index) =>
				squares[currLocation + index].classList.contains("taken")
			)
		) {
			clearInterval(timerId);
			score = 0;
			gameFinished = true;
			pauseOverlay.classList.add("overlay");
			pauseOverlay.appendChild(document.createTextNode("Game Over"));
		}
	}
});
