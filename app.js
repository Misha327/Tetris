/**TODO:
 *  [X] align the scene
 *  [X] prevent movement during pause
 *  [X] make start button restart the game after gameover
 *  [X] fix invisible tetromino after row clear
 *  [X] stop piece from overlapping when rotated into another
 *  [] if you go past the side of the grid before the tetromino is in view,
 *     it gets stuck.
 */

document.addEventListener("DOMContentLoaded", () => {
	const grid = document.querySelector(".grid");
	let squares = Array.from(document.querySelectorAll(".grid div"));
	const width = 10;
	const scoreDisplay = document.querySelector("#score");
	const button = document.querySelector("#start-button");
	const pauseOverlay = document.getElementById("overlay");
	const pauseMiniOverlay = document.getElementById("mini-overlay");
	let timerId;
	let score = 0;
	let gameFinished = false;
	let isPaused = false;
	let gameSpeed = 800;
	let disabled = false;
	let miniGridHeight = 4;
	let miniGridWidth = 3;
	let scoreThreshold = 1000;
	document.addEventListener("keydown", control);
	document.addEventListener("keyup", function () {
		down = false;
	});

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

	let color = [
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

	let currLocation = -7;
	let currRotation = 0;

	// Randomly select a tetrimino in its first rotation
	let random = Math.floor(Math.random() * tetrominoes.length);
	var nextRandom = Math.floor(Math.random() * tetrominoes.length);

	let current = tetrominoes[random][currRotation];

	function draw() {
		current.forEach((index) => {
			if (currLocation + index >= 0) {
				squares[currLocation + index].classList.add("tetromino");
				squares[currLocation + index].style.backgroundColor = color[random];
			}
		});
	}

	function undraw() {
		current.forEach((index) => {
			if (currLocation + index >= 0) {
				squares[currLocation + index].classList.remove("tetromino");
				squares[currLocation + index].style.backgroundColor = "";
			}
		});
		if (score >= scoreThreshold) {
			gameSpeed -= 80;
			clearInterval(timerId);

			timerId = setInterval(gameLoop, gameSpeed);
			scoreThreshold += 1000;
		}
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
			(index) =>
				(currLocation + index) % width == 0 ||
				(currLocation + index) % width == -10
		);
		if (!isAtLeftEdge) {
			currLocation -= 1;
		}
		for (let i = 0; i < 4; i++) {
			if (currLocation + current[i] >= 0) {
				if (squares[currLocation + current[i]].classList.contains("taken")) {
					currLocation += 1;
				}
			}
		}
		draw();
	}

	function moveRight() {
		undraw();
		const isAtRightEdge = current.some(
			(index) =>
				(currLocation + index) % width == 9 ||
				(currLocation + index) % width == -1
		);
		console.log(current.some((square) => square + currLocation));
		if (!isAtRightEdge) {
			currLocation += 1;
		}

		for (let i = 0; i < 4; i++) {
			if (currLocation + current[i] >= 0) {
				if (squares[currLocation + current[i]].classList.contains("taken")) {
					currLocation -= 1;
				}
			}
		}

		draw();
	}

	function moveDown() {
		freeze();
		undraw();
		currLocation += 10;
		score += 1;
		scoreDisplay.innerHTML = score;
		draw();
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
		// const boo = tetrominoes[random][nextRotation].some((index) =>
		// 	console.log((currLocation + index) % width)
		// );
		const isTouchingLeft = tetrominoes[random][nextRotation].some((index) => {
			if (currLocation + index - 1 >= 0) {
				return squares[currLocation + index - 1].classList.contains("taken");
			}
			console.log(currLocation + index - 1);
		});
		const isTouchingRight = tetrominoes[random][nextRotation].some((index) => {
			// Check right
			if (currLocation + index + 1 >= 0) {
				return squares[currLocation + index + 1].classList.contains("taken");
			}
		});

		if (isTouchingLeft || isTouchingRight) {
			return;
		}

		if (isAtRightEdge && isAtLeftEdge) {
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
	function displayShape() {
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
		if (nextRandom === 0 || nextRandom === 1 || nextRandom === 3) {
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
		else if (nextRandom === 2) {
			console.log("in I");
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
		console.log(displaySquares);
		upNextTetromino[nextRandom].forEach((index) => {
			displaySquares[index].classList.add("tetromino");
			displaySquares[index].style.backgroundColor = color[nextRandom];
		});
	}

	button.addEventListener("click", () => {
		if (timerId) {
			clearInterval(timerId);
			timerId = null;
			isPaused = true;

			if (gameFinished) {
				pauseOverlay.classList.remove("overlay");
				pauseOverlay.textContent = "";
				isPaused = false;
				scoreDisplay.innerHTML = score;
				nextRandom = Math.floor(Math.random() * tetrominoes.length);
				gameSpeed = 800;
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

	function nextShape() {
		addScore();
		random = nextRandom;
		nextRandom = Math.floor(Math.random() * tetrominoes.length);
		current = tetrominoes[random][0];

		displayShape();

		currLocation = -7;
		currRotation = 0;

		draw();
	}

	function freeze() {
		squares = Array.from(document.querySelectorAll(".grid div"));
		const atBottom = current.some(
			(index) => index + currLocation + width >= 200
		);
		if (atBottom) {
			current.forEach((index) => {
				squares[currLocation + index].classList.add("taken");
			});

			nextShape();
		} else {
			for (let i = 0; i < 4; i++) {
				if (currLocation + current[i] + width >= 0) {
					if (
						squares[currLocation + current[i] + width].classList.contains(
							"taken"
						)
					) {
						current.forEach((index) => {
							squares[currLocation + index].classList.add("taken");
						});

						nextShape();
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
		undraw();
		currLocation = currLocation + width;
		draw();
	}

	function gameOver() {
		for (let i = 0; i < 10; i++) {
			if (squares[i].classList.contains("taken")) {
				clearInterval(timerId);
				score = 0;
				gameFinished = true;
				pauseOverlay.classList.add("overlay");
				pauseOverlay.appendChild(document.createTextNode("Game Over"));
				return;
			}
		}
	}
});
