function Gameboard() {
    // initialization
    const rows = 3;
    const columns = 3;
    const board = [];

    // constructing 2d array
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    // methods

    // (1) getting the current board status
    const getBoard = () => board;

    // (2) printing the board
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map(cell => cell.getValue()));
        console.log(boardWithCellValues);
    };

    // (3) marking the cell
    const markCell = (row, column, player) => {
        if (board[row][column] !== undefined && board[row][column].getValue() === 0) {
            board[row][column].addToken(player);
            return 1;
        } else {
            return 0;
        }
    };

    return {
        getBoard,
        printBoard,
        markCell
    };
}

function Cell() {
    let Value = 0;

    const getValue = () => Value;

    const addToken = (player) => {
        Value = player;
    };

    return {
        getValue,
        addToken
    };
}

function GameController(PlayerOneName = "Player One", PlayerTwoName = "Player Two") {
    let board = Gameboard();

    const players = [
        {
            name: PlayerOneName,
            token: 1
        },
        {
            name: PlayerTwoName,
            token: 2
        }
    ];

    let activePlayer = players[0];

    // methods

    // switching players turn
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    // getting the active player
    const getActivePlayer = () => activePlayer;

    // new round
    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    // winner check
    const winCheck = () => {
        let currBoard = board.getBoard();
        let size = currBoard.length;

        // Check horizontal wins
        for (let row of currBoard) {
            const firstValue = row[0].getValue();
            if ((firstValue === 1 || firstValue === 2) && row.every(cell => cell.getValue() === firstValue)) {
                return true;
            }
        }

        // Check vertical wins
        for (let col = 0; col < size; col++) {
            const firstValue = currBoard[0][col].getValue();
            if (firstValue === 1 || firstValue === 2) {
                let allMatch = true;
                for (let row = 1; row < size; row++) {
                    if (currBoard[row][col].getValue() !== firstValue) {
                        allMatch = false;
                        break;
                    }
                }
                if (allMatch) {
                    return true;
                }
            }
        }

        // Check top-left to bottom-right diagonal
        const firstDiagonalValue = currBoard[0][0].getValue();
        if ((firstDiagonalValue === 1 || firstDiagonalValue === 2) && currBoard.every((row, idx) => row[idx].getValue() === firstDiagonalValue)) {
            return true;
        }

        // Check top-right to bottom-left diagonal
        const secondDiagonalValue = currBoard[0][size - 1].getValue();
        if ((secondDiagonalValue === 1 || secondDiagonalValue === 2) && currBoard.every((row, idx) => row[size - 1 - idx].getValue() === secondDiagonalValue)) {
            return true;
        }

        return false;
    };

    // playing one round
    const playRound = (row, column) => {
        if (board.markCell(row, column, getActivePlayer().token) === 0) {
            console.log(`INVALID MOVE!!!`);
        } else {
            console.log(`marking ${getActivePlayer().name}'s`);
            if (winCheck() === true) {
                console.log(`Winner is ${getActivePlayer().name}`);
                board.printBoard();
                resetGame();
                return;
            }
            switchPlayerTurn();
            printNewRound();
        }
    };

    // resetting the game
    const resetGame = () => {
        board = Gameboard(); // Reinitialize the game board
        activePlayer = players[0]; // Reset to Player One
        console.log("The game has been reset.");
        printNewRound(); // Print the initial state of the new game
    };

    printNewRound();

    return {
        playRound,
        getActivePlayer
    };
}

const game = GameController();
