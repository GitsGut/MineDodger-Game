const rows = 5;
const cols = 6;
const numMines = 6;
let minePositions = [];
let gameContainer = document.getElementById("game-container");
let gameStatus = document.getElementById("game-status");
let resetBtn = document.getElementById("reset-btn");
let luckyModeCheckbox = document.getElementById("lucky-mode");

let firstClick = true;
let secondClick = true;
let clickedCells = [];

// Initialize game
function initGame() {
    gameContainer.innerHTML = ""; // Clear the grid
    minePositions = generateMines(luckyModeCheckbox.checked);
    gameStatus.textContent = "Click on a cell to start!";
    firstClick = true;
    secondClick = true;
    clickedCells = [];

    for (let i = 0; i < rows * cols; i++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.addEventListener("click", () => handleCellClick(i));
        gameContainer.appendChild(cell);
    }
}

// Generate random mine positions with an option for "Lucky Mode"
function generateMines(luckyMode) {
    let positions = [];

    if (luckyMode) {
        // Guarantee mines are in the first and second clicks
        let firstMine = Math.floor(Math.random() * (rows * cols));
        let secondMine;
        do {
            secondMine = Math.floor(Math.random() * (rows * cols));
        } while (secondMine === firstMine);

        positions.push(firstMine, secondMine);

        while (positions.length < numMines) {
            let position = Math.floor(Math.random() * rows * cols);
            if (!positions.includes(position)) {
                positions.push(position);
            }
        }
    } else {
        while (positions.length < numMines) {
            let position = Math.floor(Math.random() * rows * cols);
            if (!positions.includes(position)) {
                positions.push(position);
            }
        }
    }

    return positions;
}

// Handle cell click
function handleCellClick(index) {
    let cell = gameContainer.children[index];

    if (cell.classList.contains("clicked")) return;

    if (minePositions.includes(index)) {
        cell.classList.add("mine");
        gameStatus.textContent = "Game Over! You hit a mine.";
        revealMines();
    } else {
        cell.classList.add("clicked");
        gameStatus.textContent = "Safe! Keep going...";
        clickedCells.push(index);
        if (luckyModeCheckbox.checked) {
            if (firstClick) {
                firstClick = false;
            } else if (secondClick) {
                secondClick = false;
                let remainingMinePosition = minePositions.find(pos => !clickedCells.includes(pos));
                if (remainingMinePosition !== undefined) {
                    gameContainer.children[remainingMinePosition].classList.add("mine");
                    gameStatus.textContent = "Game Over! You hit a mine.";
                    revealMines();
                }
            }
        }
    }
}

// Reveal all mines (after game over)
function revealMines() {
    minePositions.forEach(position => {
        let cell = gameContainer.children[position];
        cell.classList.add("mine");
    });

    Array.from(gameContainer.children).forEach(cell => {
        cell.removeEventListener("click", handleCellClick);
    });
}

// Reset the game
resetBtn.addEventListener("click", initGame);

// Start the game
initGame();
