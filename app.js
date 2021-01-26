document.addEventListener("DOMContentLoaded", () => {
	const grid = document.querySelector(".grid");
	let squares = Array.from(document.querySelectorAll(".grid div"));
	const width = 10;
	const scoreDisplay = document.querySelector("#score");
	const startButton = document.querySelector("#start-button");
	const pauseOverlay = document.getElementById("overlay");
	const pauseMiniOverlay = document.getElementById("mini-overlay");
	// Tetriminoes
	const lTetromino = [
		[1, 1 - width, 2 - width, 3 - width],
		[1 - width * 2, 2 - width * 2, 2 - width, 2],
		[1 - width, 2 - width, 3 - width, 3 - width * 2],
		[2 - width * 2, 2 - width, 2, 3],
	];

	const iTetromino = [
		[1, 2, 3, 4],
		[2 + width, 2, 2 - width, 2 - width * 2],
		[1 - width, 2 - width, 3 - width, 4 - width],
		[3, 3 + width, 3 - width, 3 - width * 2],
	];

	const tTetromino = [
		[1, 2, 3, 2 - width],
		[2 - width, 3, 2, 2 + width],
		[1, 2, 3, 2 + width],
		[2 - width, 2, 2 + width, 1],
	];

	const sTetromino = [
		[1, 2 - width, 3 - width, 2],
		[2 - width, 2, 3, 3 + width],
		[2, 1 + width, 2 + width, 3],
		[1 - width, 1, 2, 2 + width],
	];

	const oTetromino = [
		[1 - width, 2 - width, 1, 2],
		[1 - width, 2 - width, 1, 2],
		[1 - width, 2 - width, 1, 2],
		[1 - width, 2 - width, 1, 2],
	];

	const color = [
		"rgba(151, 90, 160, 0.70)",
		"rgba(200, 202, 83, 0.70)",
		"rgba(239, 123, 123, 0.72)",
		"rgba(102, 186, 214, 0.70)",
		"rgba(92, 188, 98, 0.70)",
	];

	const tetrominoes = [
		lTetromino,
		tTetromino,
		iTetromino,
		sTetromino,
		oTetromino,
	];

	let timerId;
	let score = 0;
	let gameFinished = false;
	let isPaused = false;
	let gameSpeed = 800;
	let disabled = false;
	let miniGridHeight = 4;
	let miniGridWidth = 3;
	let scoreThreshold = 1000;
	let currentLocation = -7;
	let currentRotation = 0;

	document.addEventListener("keydown", control);
	document.addEventListener("keyup", function () {
		down = false;
	});

	// Randomly select a tetrimino in its first rotation
	let nextTetromino = Math.floor(Math.random() * tetrominoes.length);
	let currentTetromino = tetrominoes[nextTetromino][currentRotation];

	function drawTetromino() {
		currentTetromino.forEach((index) => {
			if (currentLocation + index >= 0) {
				squares[currentLocation + index].classList.add("tetromino");
				squares[currentLocation + index].style.backgroundColor =
					color[nextTetromino];
			}
		});
	}

	function undrawTetromino() {
		currentTetromino.forEach((index) => {
			if (currentLocation + index >= 0) {
				squares[currentLocation + index].classList.remove("tetromino");
				squares[currentLocation + index].style.backgroundColor = "";
			}
		});
		if (score >= scoreThreshold) {
			gameSpeed -= 80;
			clearInterval(timerId);

			timerId = setInterval(gameLoop, gameSpeed);
			scoreThreshold += 1000;
		}
	}

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

	function moveLeft() {
		undrawTetromino();
		const isAtLeftEdge = currentTetromino.some(
			(index) =>
				(currentLocation + index) % width == 0 ||
				(currentLocation + index) % width == -10
		);
		if (!isAtLeftEdge) {
			currentLocation -= 1;
		}
		for (let i = 0; i < 4; i++) {
			if (currentLocation + currentTetromino[i] >= 0) {
				if (
					squares[currentLocation + currentTetromino[i]].classList.contains(
						"taken"
					)
				) {
					currentLocation += 1;
				}
			}
		}
		drawTetromino();
	}

	function moveRight() {
		undrawTetromino();
		const isAtRightEdge = currentTetromino.some(
			(index) =>
				(currentLocation + index) % width == 9 ||
				(currentLocation + index) % width == -1
		);
		if (!isAtRightEdge) {
			currentLocation += 1;
		}

		for (let i = 0; i < 4; i++) {
			if (currentLocation + currentTetromino[i] >= 0) {
				if (
					squares[currentLocation + currentTetromino[i]].classList.contains(
						"taken"
					)
				) {
					currentLocation -= 1;
				}
			}
		}

		drawTetromino();
	}

	function moveDown() {
		freeze();
		undrawTetromino();
		currentLocation += 10;
		score += 1;
		scoreDisplay.innerHTML = score;
		drawTetromino();
	}

	startButton.addEventListener("click", () => {
		if (timerId) {
			clearInterval(timerId);
			timerId = null;
			isPaused = true;
			startButton.innerHTML = "Unpause";

			if (gameFinished) {
				pauseOverlay.classList.remove("overlay");
				pauseOverlay.textContent = "";
				isPaused = false;
				scoreDisplay.innerHTML = score;
				nextTetromino = Math.floor(Math.random() * tetrominoes.length);
				gameSpeed = 800;
				startButton.innerHTML = "Start";

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
				gameFinished = false;
			}

			if (isPaused) {
				pauseMiniOverlay.classList.add("overlay");
				pauseOverlay.classList.add("overlay");
				pauseOverlay.appendChild(document.createTextNode("Paused"));
			}
		} else {
			displayNextUp();

			if (isPaused) {
				pauseOverlay.classList.remove("overlay");
				pauseMiniOverlay.classList.remove("overlay");
				pauseOverlay.textContent = "";

				isPaused = false;
			}
			startButton.innerHTML = "Pause";
			timerId = setInterval(gameLoop, gameSpeed);
		}
	});

	function rotate() {
		let nextRotation = currentRotation + 1;
		if (nextRotation == currentTetromino.length) {
			nextRotation = 0;
		}
		const isAtLeftEdge = tetrominoes[nextTetromino][nextRotation].some(
			(index) => (currentLocation + index) % width == 0
		);
		const isAtRightEdge = tetrominoes[nextTetromino][nextRotation].some(
			(index) => (currentLocation + index) % width == 9
		);

		const isTouchingLeft = tetrominoes[nextTetromino][nextRotation].some(
			(index) => {
				if (currentLocation + index - 1 >= 0) {
					return squares[currentLocation + index - 1].classList.contains(
						"taken"
					);
				}
			}
		);
		const isTouchingRight = tetrominoes[nextTetromino][nextRotation].some(
			(index) => {
				// Check right
				if (currentLocation + index + 1 >= 0) {
					return squares[currentLocation + index + 1].classList.contains(
						"taken"
					);
				}
			}
		);

		if (isTouchingLeft || isTouchingRight) {
			return;
		}

		if (isAtRightEdge && isAtLeftEdge) {
			return;
		} else {
			undrawTetromino();

			currentRotation++;
			if (currentRotation == currentTetromino.length) {
				currentRotation = 0;
			}
			currentTetromino = tetrominoes[nextTetromino][currentRotation];
			drawTetromino();
		}
		freeze();
	}

	// Show up-next tetromino in mini-grid display
	function displayNextUp() {
		const miniGrid = document.querySelector(".mini-grid");
		/*
      mini grid sizes h x w
      L = 4x3 
      T = 4x3
      I = 3x4
      S = 4x3 
      O = 4x2
    */

		//  L, T, S
		if (nextTetromino === 0 || nextTetromino === 1 || nextTetromino === 3) {
			if (miniGrid.childElementCount === 12) {
				miniGrid.style.height = "84px";
				miniGridHeight = 4;

				miniGrid.style.width = "63px";
				miniGridWidth = 3;
			} else {
				for (let i = 0; i < 4; i++) {
					miniGrid.appendChild(document.createElement("div"));
				}
				miniGrid.style.height = "84px";
				miniGrid.style.width = "63px";
				miniGridHeight = 4;
				miniGridWidth = 3;
			}
		}
		//  I
		else if (nextTetromino === 2) {
			if (miniGrid.childElementCount === 12) {
				miniGrid.style.height = "63px";
				miniGridHeight = 3;

				miniGrid.style.width = "84px";
				miniGridWidth = 4;
			} else {
				for (let i = 0; i < 4; i++) {
					miniGrid.appendChild(document.createElement("div"));
				}
				miniGrid.style.height = "63px";
				miniGrid.style.width = "84px";
				miniGridHeight = 3;
				miniGridWidth = 4;
			}
		}

		// O
		else {
			if (miniGridHeight != 4) {
				for (let i = 0; i < 4; i++) {
					miniGrid.appendChild(document.createElement("div"));
				}
				miniGrid.style.height = "84px";
				miniGridHeight = 4;
			}
			if (miniGridWidth != 2) {
				for (let i = 0; i < 4; i++) {
					miniGrid.removeChild(miniGrid.lastElementChild);
				}
				miniGrid.style.width = "42px";
				miniGridWidth = 2;
			}
		}

		let upNextTetromino = [
			// L
			[
				0 + miniGridWidth,
				0 + miniGridWidth * 2,
				1 + miniGridWidth,
				2 + miniGridWidth,
			],

			// T
			[
				0 + miniGridWidth * 2,
				1 + miniGridWidth * 2,
				2 + miniGridWidth * 2,
				1 + miniGridWidth,
			],
			// I
			[
				0 + miniGridWidth,
				1 + miniGridWidth,
				2 + miniGridWidth,
				3 + miniGridWidth,
			],
			// S
			[
				0 + miniGridWidth * 2,
				1 + miniGridWidth,
				2 + miniGridWidth,
				1 + miniGridWidth * 2,
			],
			//  O
			[
				0 + miniGridWidth,
				1 + miniGridWidth,
				0 + miniGridWidth * 2,
				1 + miniGridWidth * 2,
			],
		];
		const displaySquares = document.querySelectorAll(".mini-grid div");
		displaySquares.forEach((square) => {
			square.classList.remove("tetromino");
			square.style.backgroundColor = "";
		});
		upNextTetromino[nextTetromino].forEach((index) => {
			displaySquares[index].classList.add("tetromino");
			displaySquares[index].style.backgroundColor = color[nextTetromino];
		});
	}

	function pickNextTetromino() {
		addScore();
		nextTetromino = nextTetromino;
		nextTetromino = Math.floor(Math.random() * tetrominoes.length);
		currentTetromino = tetrominoes[nextTetromino][0];

		displayNextUp();

		currentLocation = -7;
		currentRotation = 0;

		drawTetromino();
	}

	function freeze() {
		squares = Array.from(document.querySelectorAll(".grid div"));
		const atBottom = currentTetromino.some(
			(index) => index + currentLocation + width >= 200
		);
		if (atBottom) {
			currentTetromino.forEach((index) => {
				squares[currentLocation + index].classList.add("taken");
			});

			pickNextTetromino();
		} else {
			for (let i = 0; i < 4; i++) {
				if (currentLocation + currentTetromino[i] + width >= 0) {
					if (
						squares[
							currentLocation + currentTetromino[i] + width
						].classList.contains("taken")
					) {
						currentTetromino.forEach((index) => {
							squares[currentLocation + index].classList.add("taken");
						});

						pickNextTetromino();
						return;
					}
				}
			}
		}
	}

	function addScore() {
		disabled = true;
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
				score += 100;
				scoreDisplay.innerHTML = score;

				row.forEach((index) => {
					squares[index].classList.remove("taken");
					squares[index].classList.remove("tetromino");
					squares[index].style.backgroundColor = "";
				});
				const squaresRemoved = squares.splice(i, width);
				squares = squaresRemoved.concat(squares);
				squares.forEach((cell) => grid.appendChild(cell));
			}
		}
		disabled = false;
	}

	function gameLoop() {
		gameOver();
		freeze();
		undrawTetromino();
		currentLocation = currentLocation + width;
		drawTetromino();
	}

	function gameOver() {
		for (let i = 0; i < 10; i++) {
			if (squares[i].classList.contains("taken")) {
				clearInterval(timerId);
				score = 0;
				gameFinished = true;
				startButton.innerHTML = "Reset";

				pauseOverlay.classList.add("overlay");
				pauseOverlay.appendChild(document.createTextNode("Game Over"));
				return;
			}
		}
	}
});
